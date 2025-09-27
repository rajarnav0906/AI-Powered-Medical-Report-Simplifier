import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10-minute window
  max: 15,                  // Limit each IP to 15 requests per window
  standardHeaders: true,
  legacyHeaders: false,     
  message: {
    status: "error",
    error: "Too many requests. Please wait 10 minutes before retrying.",
  },
});