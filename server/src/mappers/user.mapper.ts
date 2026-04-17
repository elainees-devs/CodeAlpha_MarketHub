import { IUser} from "../types/interfaces.types";
import { UserResponse } from "../schemas";

/**
 * Prisma User Entity type (raw DB shape)
 */
export type UserEntity = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  deleted_at: Date | null;
};

/**
 * ======================
 * USER MAPPER
 * ======================
 */
export const mapUser = (user: UserEntity): IUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password_hash: user.password_hash,
    created_at: user.created_at,
    deleted_at: user.deleted_at ?? null,
  };
};

/**
 * Public response (safe for API)
 */
export const mapUserResponse = (user: UserEntity): UserResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
};