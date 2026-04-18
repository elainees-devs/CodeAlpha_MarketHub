import { Response, NextFunction } from "express";
import { ApiError } from "../utils";
import { AuthRequest } from "./auth.middleware";

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ApiError(401, "Unauthorized: No user found"));
    }

    // if roles exist in DB later, extend this safely
    const userRoles: string[] = (user as any).roles ?? [];

    const hasRole = userRoles.some((role: string) =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return next(new ApiError(403, "Forbidden: Access denied"));
    }

    next();
  };
};