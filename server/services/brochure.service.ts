import puppeteer, { Browser } from "puppeteer";

/**
 * Browser Manager to handle singleton browser instance and lifecycle.
 */
export class BrowserManager {
  private static instance: Browser | null = null;
  private static initPromise: Promise<Browser> | null = null;

  static async getBrowser(): Promise<Browser> {
    if (this.instance && this.instance.connected) {
      return this.instance;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        const browser = await puppeteer.launch({
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // Fixes OOM in Docker/Render
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote",
            "--single-process", // Reduces memory usage on low-resource environments
          ],
          headless: true,
        });

        browser.on("disconnected", () => {
          this.instance = null;
          this.initPromise = null;
        });

        this.instance = browser;
        return browser;
      } catch (error) {
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  static async closeBrowser() {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
      this.initPromise = null;
    }
  }
}

// Simple in-memory cache for PDF generation (last 10 unique requests)
const pdfCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 10;

// Simple concurrency semaphore to prevent OOM on Render
let activeRequests = 0;
const MAX_CONCURRENT_PDFS = 2;

/**
 * Service to generate a PDF brochure using Puppeteer.
 * 
 * @param data - Brochure data for rendering
 * @returns - PDF Buffer
 */
export const generateBrochureService = async (data: any): Promise<Buffer> => {
  // Generate a simple cache key based on relevant data
  const cacheKey = JSON.stringify({
    clientName: data.clientName,
    eventType: data.eventType,
    eventDate: data.eventDate,
    location: data.location,
    finalPrice: data.finalPrice,
  });

  // Check cache
  const cached = pdfCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.buffer;
  }

  // Wait if too many requests are active
  while (activeRequests >= MAX_CONCURRENT_PDFS) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  activeRequests++;
  let page;
  try {
    const browser = await BrowserManager.getBrowser();
    page = await browser.newPage();

    // Optimize page for speed
    await page.setCacheEnabled(true);
    
    // Render HTML template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; }
            .serif { font-family: 'Playfair Display', serif; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body class="bg-white p-0 m-0">
          <div class="p-[15mm] text-neutral-900">
            <div class="h-[267mm] flex flex-col justify-between border-[8px] border-neutral-900 p-12 relative overflow-hidden">
              <div>
                <div class="text-4xl font-bold italic serif tracking-tighter mb-2">SINGLEFRAME</div>
                <div class="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Boutique Visual Studio</div>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-[0.5em] text-neutral-400 mb-6">Proposal For</div>
                <h1 class="text-6xl font-bold italic serif leading-none mb-4">${data.clientName || "Valued Client"}</h1>
                <div class="flex items-center gap-6 text-sm font-medium border-t border-neutral-200 pt-6">
                  <span class="uppercase tracking-widest">${data.eventType || "Event"}</span>
                  <span>${data.eventDate || "Date TBD"}</span>
                  <span>${data.location || "Location TBD"}</span>
                </div>
              </div>
              <div class="flex justify-between items-end">
                <div class="max-w-xs text-xs text-neutral-500">
                  We don't just capture moments; we craft visual legacies.
                </div>
                <div class="text-right">
                  <div class="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Estimated Investment</div>
                  <div class="text-3xl font-bold italic serif">₹${data.finalPrice?.toLocaleString() || "0"}</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const buffer = Buffer.from(pdf);

    // Update cache
    if (pdfCache.size >= MAX_CACHE_SIZE) {
      const firstKey = pdfCache.keys().next().value;
      if (firstKey) pdfCache.delete(firstKey);
    }
    pdfCache.set(cacheKey, { buffer, timestamp: Date.now() });

    return buffer;
  } catch (error) {
    console.error("Brochure Service Error:", error);
    throw new Error("Failed to generate PDF brochure");
  } finally {
    activeRequests--;
    if (page) {
      await page.close().catch(() => {});
    }
  }
};
