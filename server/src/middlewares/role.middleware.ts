import { Response, NextFunction } from "express";
import { ApiError } from "../utils";
import { AuthRequest } from "./auth.middleware";

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ApiError(401, "Unauthorized: No user found"));
    }

    // Extract role names safely from IRole[]
    const userRoles = (user.roles || []).map((role) => role.name);

    const hasRole = userRoles.some((roleName) =>
      allowedRoles.includes(roleName)
    );

    if (!hasRole) {
      return next(new ApiError(403, "Forbidden: Access denied"));
    }

    next();
  };
};