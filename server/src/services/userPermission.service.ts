import { prisma } from "../utils";
import { IUserPermission } from "../types/interfaces.types";
import {
  UserPermissionEntity,
  mapUserPermission,
} from "../mappers";
import { ApiError } from "../utils";

class UserPermissionService {
  // =====================================================
  // ASSIGN PERMISSION TO USER
  // =====================================================
  async assignPermissionToUser(
    user_id: number,
    permission_id: number
  ): Promise<IUserPermission> {
    const exists = await prisma.user_permissions.findFirst({
      where: { user_id, permission_id },
    });

    if (exists) {
      throw new ApiError(409, "Permission already assigned to user");
    }

    const up = await prisma.user_permissions.create({
      data: { user_id, permission_id },
    });

    return mapUserPermission(up as UserPermissionEntity);
  }

  // =====================================================
  // REMOVE PERMISSION FROM USER
  // =====================================================
  async removePermissionFromUser(
    user_id: number,
    permission_id: number
  ): Promise<void> {
    const exists = await prisma.user_permissions.findFirst({
      where: { user_id, permission_id },
    });

    if (!exists) {
      throw new ApiError(404, "User permission not found");
    }

    await prisma.user_permissions.deleteMany({
      where: { user_id, permission_id },
    });
  }

  // =====================================================
  // GET PERMISSIONS BY USER
  // =====================================================
  async getPermissionsByUser(user_id: number): Promise<IUserPermission[]> {
    const userPermissions = await prisma.user_permissions.findMany({
      where: { user_id },
    });

    return userPermissions.map((up: UserPermissionEntity) =>
      mapUserPermission(up)
    );
  }
}

export const userPermissionService = new UserPermissionService();