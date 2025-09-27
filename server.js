import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";


import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({
    service: "AI-Powered Medical Report Simplifier",
    status: "running smoothly",
  });
});


app.use("/api/report", reportRoutes);

app.listen(PORT, () => {
  console.log(` Server started at http://localhost:${PORT}`);
});
