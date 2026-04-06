import { Router } from "express";
import { generateBrochureController } from "../controllers/brochure.controller.js";

const router = Router();

// POST /api/brochure/generate
router.post("/generate", generateBrochureController);

export { router as brochureRouter };
