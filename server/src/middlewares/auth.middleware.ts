import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils';

// Extend the Express Request type to include the user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    user_id: number;
    username: string;
    email: string;
  };
}

export const authenticateMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from header (Format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    // Check if user still exists in PostgreSQL via Prisma
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, user_id: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Attach user to request and move to next middleware/controller
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};