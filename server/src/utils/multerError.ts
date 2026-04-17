import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const handleUploadError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new Error("File too large (max 2MB)"));
    }
  }

  if (err) return next(err);

  next();
};