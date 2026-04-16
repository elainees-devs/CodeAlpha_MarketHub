import { Request, Response, NextFunction } from "express";
import { prisma, verifyToken } from "../utils";

export const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token required" });
    }

    // use centralized token utility
    const decoded = verifyToken(token);

    if (!decoded) {
      return res
        .status(403)
        .json({ message: "Invalid or expired token" });
    }

    const payload = decoded as { id: number };

    // fetch user from DB
    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        user_id: true,
        username: true,
        email: true,
        roles: true
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // attach to request (typed via express.d.ts)
    req.user = user;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};