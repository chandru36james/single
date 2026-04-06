import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// Load environment variables
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;
/**
 * ✅ Optimization: catchAsync utility to handle async route errors
 * Prevents unhandled promise rejections from crashing the process.
 */
export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// 1. Trust Proxy (Crucial for Render/Vercel/Cloudflare)
app.set("trust proxy", 1);
// 2. Security Headers
app.use(helmet());
// 3. Performance: Response Compression
app.use(compression());
// 4. Request Logging
app.use(morgan("combined"));
// 4. CORS Configuration
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// 5. Body Parsing
app.use(express.json({ limit: "10kb" })); // Limit body size for security
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// 6. Timeout Protection (30 seconds)
// ✅ Fix: Check headersSent to prevent duplicate responses or crashes
app.use((req, res, next) => {
    const timeout = 30000;
    const timer = setTimeout(() => {
        if (!res.headersSent) {
            res.status(408).json({ error: "Request Timeout" });
        }
    }, timeout);
    res.on("finish", () => clearTimeout(timer));
    res.on("close", () => clearTimeout(timer));
    next();
});
// 7. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/", limiter);
// 8. Health Check Route
// ⚠️ Improvement: Added uptime and timestamp
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
    });
});
// --- API Routes ---
import { brochureRouter } from "./routes/brochure.routes.js";
app.use("/api/brochure", brochureRouter);
// 9. Global 404 Handler
app.use((req, res) => {
    if (!res.headersSent) {
        res.status(404).json({ error: "Route not found" });
    }
});
// 10. Global Error Handling Middleware
// ✅ Fix: Consistent JSON response and no stack leak in production
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error("Unhandled Error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
});
// Start Server
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Production-ready server running on port ${PORT}`);
    console.log(`🔗 Allowed Origins: ${allowedOrigins.join(", ")}`);
});
// 11. Graceful Shutdown & Error Handling
// ✅ Fix: Prevent silent crashes and handle hanging connections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception thrown:", err);
    process.exit(1);
});
import { BrowserManager } from "./services/brochure.service.js";
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    // Close Puppeteer browser if open
    BrowserManager.closeBrowser().catch(console.error);
    server.close(() => {
        console.log("Process terminated.");
        process.exit(0);
    });
    // Force exit after 10s if server.close hangs
    setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
    }, 10000);
});
