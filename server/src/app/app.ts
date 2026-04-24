import express from "express";
import routes from "../routes";

const app = express();

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);

  res.status(err?.statusCode || 500).json({
    success: false,
    message: err?.message || "An unexpected error occurred",
  });
});

export default app;