import { IUserRole } from "../types/interfaces.types";

/**
 * ======================
 * USER ROLE ENTITY (DB)
 * ======================
 */
export type UserRoleEntity = {
  user_id: number;
  role_id: number;
};

/**
 * ======================
 * USER ROLE MAPPER
 * ======================
 */

/**
 * DB → IUserRole (internal/API safe)
 */
export const mapUserRole = (ur: UserRoleEntity): IUserRole => {
  return {
    user_id: ur.user_id,
    role_id: ur.role_id,
  };
};