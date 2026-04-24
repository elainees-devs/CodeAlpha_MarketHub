import { IAuthUser, IUser, IRole } from "../types/interfaces.types";
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
 * Auth Entity (DB shape including roles from relations)
 */
export type AuthEntity = {
  id: number;
  name: string;
  email: string;
  roles: IRole[];
  created_at: Date;
  deleted_at: Date | null;
};

/**
 * ======================
 * USER MAPPERS
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
 * Public user response mapper (NO sensitive data)
 */
export const mapUserResponse = (user: UserEntity): UserResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
};

/**
 * ======================
 * AUTH USER MAPPERS
 * ======================
 */

/**
 * Internal auth user (used in JWT / middleware / req.user)
 */
export const mapAuthUser = (authUser: AuthEntity): IAuthUser => {
  return {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    roles: authUser.roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      created_at: role.created_at,
    })),
  };
};

/**
 * Public auth response (login/register response)
 */
export const mapAuthUserResponse = (authUser: AuthEntity): UserResponse => {
  return {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    created_at: authUser.created_at,
  };
};