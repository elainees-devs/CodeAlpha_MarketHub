import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { roles?: string[] };

    if (!user) {
      return next(new ApiError(401, "Unauthorized: No user found"));
    }

    const userRoles = user.roles ?? [];

    const hasRole = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return next(new ApiError(403, "Forbidden: Access denied"));
    }

    next();
  };
};