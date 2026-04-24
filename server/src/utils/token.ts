import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  id: number;
  email?: string;
  roles?: string[];
}
const JWT_SECRET = process.env.JWT_SECRET as string;

// strongly typed expiresIn
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = "1d";

/**
 * Generate JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};



/**
 * Verify JWT token and return decoded payload
 */

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

  /**
   * Refresh token
   */
export const refreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true,
    }) as JwtPayload;

    return generateToken({
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,  // RBAC support
    });
  } catch {
    return null;
  }
};
