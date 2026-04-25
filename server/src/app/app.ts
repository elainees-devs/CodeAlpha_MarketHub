import express from "express";
import cors from "cors";
import routes from "../routes";

const app = express();

// =====================================================
// CORS CONFIG
// =====================================================
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

// =====================================================
// Middleware
// =====================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// API PREFIX
// =====================================================
app.use("/api", routes);

// =====================================================
// ERROR HANDLER
// =====================================================
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);

    res.status(err?.statusCode || 500).json({
      success: false,
      message: err?.message || "An unexpected error occurred",
    });
  }
);

export default app;