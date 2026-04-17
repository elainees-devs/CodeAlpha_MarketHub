import { prisma, ApiError } from "../utils";
import { IUserRole } from "../types/interfaces.types";
import { mapUserRole, UserRoleEntity } from "../mappers";
import {
  AssignUserRoleInput,
  RemoveUserRoleInput,
} from "../schemas";

class UserRoleService {
  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(
    data: AssignUserRoleInput
  ): Promise<IUserRole> {
    const { user_id, role_id } = data;

    const existing = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: { user_id, role_id },
      },
    });

    if (existing) {
      throw new ApiError(409, "User already has this role");
    }

    const result = await prisma.user_roles.create({
      data: { user_id, role_id },
    });

    return mapUserRole(result as UserRoleEntity);
  }

  // =====================================================
  // REMOVE ROLE FROM USER
  // =====================================================
  async removeRoleFromUser(
    data: RemoveUserRoleInput
  ): Promise<void> {
    const { user_id, role_id } = data;

    const existing = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: { user_id, role_id },
      },
    });

    if (!existing) {
      throw new ApiError(404, "Role assignment not found");
    }

    await prisma.user_roles.delete({
      where: {
        user_id_role_id: { user_id, role_id },
      },
    });
  }

  // =====================================================
  // GET ROLES BY USER
  // =====================================================
  async getRolesByUser(user_id: number): Promise<IUserRole[]> {
    const roles = await prisma.user_roles.findMany({
      where: { user_id },
    });

    return roles.map((r: UserRoleEntity) => mapUserRole(r));
  }
}

export const userRoleService = new UserRoleService();