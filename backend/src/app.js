import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PRODUCTION_URL } from "./constants.js";
export const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? `${PRODUCTION_URL}`
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/jobs.routes.js";
import companyRouter from "./routes/company.routes.js";
import externalJobsRouter from "./routes/externalJobs.routes.js";
import geminiJobsRouter from "./routes/geminiJobs.routes.js";
// routes declearation

app.use("/api/v1/users", userRouter);
app.use("/api/v1/", jobRouter);
app.use("/api/v1/", externalJobsRouter);
app.use("/api/v1/gemini-jobs", geminiJobsRouter);
app.use("/api/v1/company/", companyRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.statusCode = 409;
    err.message = `${field} already exists`;
  }
  
  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    err.message = messages;
  }

  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong",
    data: null,
    success: false,
    errors: err.errors || [],
  });
});
