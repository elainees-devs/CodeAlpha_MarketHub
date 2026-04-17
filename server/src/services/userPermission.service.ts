import { prisma, ApiError } from "../utils";
import { IUserPermission } from "../types/interfaces.types";
import {
  mapUserPermission,
  UserPermissionEntity,
} from "../mappers";
import {
  AssignUserPermissionInput,
  RemoveUserPermissionInput,
} from "../schemas";

class UserPermissionService {
  // =====================================================
  // ASSIGN PERMISSION TO USER
  // =====================================================
  async assignPermissionToUser(
    data: AssignUserPermissionInput
  ): Promise<IUserPermission> {
    const { user_id, permission_id } = data;

    const existing = await prisma.user_permissions.findUnique({
      where: {
        user_id_permission_id: {
          user_id,
          permission_id,
        },
      },
    });

    if (existing) {
      throw new ApiError(409, "User already has this permission");
    }

    const result = await prisma.user_permissions.create({
      data: {
        user_id,
        permission_id,
      },
    });

    return mapUserPermission(result as UserPermissionEntity);
  }

  // =====================================================
  // REMOVE PERMISSION FROM USER
  // =====================================================
  async removePermissionFromUser(
    data: RemoveUserPermissionInput
  ): Promise<void> {
    const { user_id, permission_id } = data;

    const existing = await prisma.user_permissions.findUnique({
      where: {
        user_id_permission_id: {
          user_id,
          permission_id,
        },
      },
    });

    if (!existing) {
      throw new ApiError(404, "User permission not found");
    }

    await prisma.user_permissions.delete({
      where: {
        user_id_permission_id: {
          user_id,
          permission_id,
        },
      },
    });
  }

  // =====================================================
  // GET PERMISSIONS BY USER
  // =====================================================
  async getPermissionsByUser(
    user_id: number
  ): Promise<IUserPermission[]> {
    const permissions = await prisma.user_permissions.findMany({
      where: { user_id },
    });

    return permissions.map((p: UserPermissionEntity) =>
      mapUserPermission(p)
    );
  }
}

export const userPermissionService = new UserPermissionService();