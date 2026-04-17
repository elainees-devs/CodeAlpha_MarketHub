import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// strongly typed expiresIn
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = "1d";

/**
 * Generate JWT token
 */
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

  /**
   * Refresh token
   */
  export const refreshToken = (token: string): string | null => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
      return generateToken({ id: (decoded as any).id });
    } catch {
      return null;
    }
  }
