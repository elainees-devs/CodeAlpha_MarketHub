import dotenv from "dotenv";
import app from "./app/app";


dotenv.config();

// =====================================================
// ENV CONFIG
// =====================================================
const PORT = process.env.PORT || 3000;

// =====================================================
// START SERVER
// =====================================================
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// =====================================================
// HANDLE UNHANDLED PROMISE REJECTIONS
// =====================================================
process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

// =====================================================
// HANDLE UNCAUGHT EXCEPTIONS
// =====================================================
process.on("uncaughtException", (err: any) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// =====================================================
// GRACEFUL SHUTDOWN (CTRL+C / SIGTERM)
// =====================================================
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});