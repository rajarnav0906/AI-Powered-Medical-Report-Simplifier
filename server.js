// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Core dependencies
import express from "express";
import cors from "cors";

// Import routes
import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());              // Enable cross-origin requests
app.use(express.json());      // Parse JSON bodies

// Health check route
app.get("/ping", (req, res) => {
  res.json({
    service: "AI-Powered Medical Report Simplifier",
    status: "running smoothly",
  });
});

// Main API routes
app.use("/api/report", reportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(` Server started at http://localhost:${PORT}`);
});
