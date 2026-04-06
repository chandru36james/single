import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { brochureRouter } from "./server/routes/brochure.routes.js";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.warn("Firebase Admin failed to initialize with applicationDefault. Using placeholder for local dev.");
  }
}

const db = admin.apps.length ? admin.firestore() : null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Adjusted for development
  }));

  // CORS Configuration
  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ais-dev-pxtvt2ysnc7pmfws36dhub-274935142024.asia-southeast1.run.app",
    "https://ais-pre-pxtvt2ysnc7pmfws36dhub-274935142024.asia-southeast1.run.app"
  ].filter(Boolean) as string[];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/", limiter);

  // Auth Middleware for Admin APIs
  const checkAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userDoc = await db?.collection("users").doc(decodedToken.uid).get();
      const role = userDoc?.data()?.role;

      if (role === "admin" || decodedToken.email === "vgotyou3@gmail.com") {
        (req as any).user = decodedToken;
        next();
      } else {
        res.status(403).json({ error: "Forbidden: Admin access required" });
      }
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Use the new brochure router
  app.use("/api/brochure", brochureRouter);

  // Secure Export Endpoint
  app.get("/api/admin/export-leads", checkAdmin, async (req, res) => {
    console.log(`Export initiated by ${(req as any).user.email}`);
    try {
      const leadsSnapshot = await db?.collection("leads").orderBy("createdAt", "desc").get();
      const leads = leadsSnapshot?.docs.map(doc => doc.data()) || [];

      const headers = ["Name", "Email", "Phone", "Type", "Status", "Created At"];
      const csvRows = [headers.join(",")];

      leads.forEach(lead => {
        const row = [
          `"${lead.name || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.type || ''}"`,
          `"${lead.status || ''}"`,
          `"${lead.createdAt?.toDate?.()?.toISOString() || ''}"`
        ];
        csvRows.push(row.join(","));
      });

      res.header('Content-Type', 'text/csv');
      res.attachment(`leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvRows.join("\n"));
    } catch (error) {
      console.error("Export Error:", error);
      res.status(500).json({ error: "Failed to export leads" });
    }
  });

  // Sitemap Generator
  app.get("/sitemap.xml", async (req, res) => {
    console.log("Generating sitemap...");
    try {
      let baseUrl = process.env.CLIENT_URL || process.env.APP_URL;
      if (!baseUrl) {
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host || 'localhost:3000';
        baseUrl = `${protocol}://${host}`;
      }
      
      baseUrl = baseUrl.replace(/\/$/, '');
      
      const staticRoutes = [
        { url: '', priority: '1.0' },
        { url: '/services', priority: '0.8' },
        { url: '/journal', priority: '0.8' },
        { url: '/contact', priority: '0.8' },
        { url: '/about', priority: '0.8' },
        { url: '/gallery', priority: '0.8' }
      ];

      let dynamicRoutes: { url: string, priority: string }[] = [];
      let postRoutes: { url: string, priority: string }[] = [];

      if (db) {
        try {
          const pagesSnapshot = await db.collection("pages").get();
          dynamicRoutes = pagesSnapshot.docs
            .map(doc => doc.data())
            .filter(data => data.slug)
            .map(data => ({
              url: `/p/${data.slug}`,
              priority: '0.6'
            }));

          const postsSnapshot = await db.collection("posts").get();
          postRoutes = postsSnapshot.docs
            .map(doc => doc.data())
            .filter(data => data.slug && data.status === 'published')
            .map(data => ({
              url: `/journal/${data.slug}`,
              priority: '0.6'
            }));
        } catch (dbError) {
          console.warn("Sitemap: Database fetch failed", dbError);
        }
      }

      const allRoutes = [...staticRoutes, ...dynamicRoutes, ...postRoutes];
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap Error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // API Route for PDF Generation (REPLACED BY /api/brochure/generate)
  // ... (old code removed)

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(process.cwd(), 'dist');

  console.log('Serving static from:', distPath); // remove after confirming

  app.use(express.static(distPath, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
      if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    }
  }));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).end();
    }
    if (req.path.match(/\.(css|js|png|jpg|svg|ico|woff2?|ttf)$/)) {
      return res.status(404).end();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();

