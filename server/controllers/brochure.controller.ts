import { Request, Response, NextFunction } from "express";
import { generateBrochureService } from "../services/brochure.service.js";

/**
 * Controller for generating a PDF brochure.
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction object
 */
export const generateBrochureController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    
    // Basic validation
    if (!data || !data.clientName) {
      return res.status(400).json({ error: "Missing required brochure data (clientName)" });
    }

    const pdfBuffer = await generateBrochureService(data);
    
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Brochure Controller Error:", error);
    next(error); // Pass to global error handler
  }
};
