import express from "express";
import multer from "multer";
import { simplifyReport } from "../controllers/reportController.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/simplify",
  apiLimiter,
  upload.single("file"),
  simplifyReport
);

export default router;