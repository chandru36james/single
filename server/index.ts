// server/index.ts

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 1. Trust Proxy
app.set("trust proxy", 1);

// 2. ✅ Serve static files FIRST — before CORS, before everything
const distPath = path.resolve(__dirname, "../../dist");
if (fs.existsSync(distPath)) {
  console.log("✅ dist folder found, serving static files from:", distPath);
  app.use(express.static(distPath));
} else {
  console.warn("⚠️ dist folder NOT found at:", distPath);
}

// 3. Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// 4. Compression
app.use(compression());

// 5. Logging
app.use(morgan("combined"));

// 6. CORS — only needed for API routes
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://single-w5j.onrender.com", // ← add this
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 7. Body Parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 8. Timeout Protection
app.use((req: Request, res: Response, next: NextFunction) => {
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

// 9. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// 10. Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 11. API Routes
import { brochureRouter } from "./routes/brochure.routes.js";
app.use("/api/brochure", brochureRouter);

// 12. SPA Fallback — serve index.html for all non-API frontend routes
if (fs.existsSync(distPath)) {
  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// 13. Global 404 Handler
app.use((req: Request, res: Response) => {
  if (!res.headersSent) {
    res.status(404).json({ error: "Route not found" });
  }
});

// 14. Global Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);
  console.error("Unhandled Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// 15. Start Server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Allowed Origins: ${allowedOrigins.join(", ")}`);
});

// 16. Graceful Shutdown
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
  BrowserManager.closeBrowser().catch(console.error);
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
});