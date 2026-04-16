import { prisma } from "../utils";
import { IRolePermission } from "../types/interfaces.types";
import {
  RolePermissionEntity,
  mapRolePermission,
} from "../mappers";
import { ApiError } from "../utils";

class RolePermissionService {
  // =====================================================
  // ASSIGN PERMISSION TO ROLE
  // =====================================================
  async assignPermissionToRole(
    role_id: number,
    permission_id: number
  ): Promise<IRolePermission> {
    const exists = await prisma.role_permissions.findFirst({
      where: { role_id, permission_id },
    });

    if (exists) {
      throw new ApiError(409, "Permission already assigned to role");
    }

    const rp = await prisma.role_permissions.create({
      data: { role_id, permission_id },
    });

    return mapRolePermission(rp as RolePermissionEntity);
  }

  // =====================================================
  // REMOVE PERMISSION FROM ROLE
  // =====================================================
  async removePermissionFromRole(
    role_id: number,
    permission_id: number
  ): Promise<void> {
    const exists = await prisma.role_permissions.findFirst({
      where: { role_id, permission_id },
    });

    if (!exists) {
      throw new ApiError(404, "Role permission not found");
    }

    await prisma.role_permissions.deleteMany({
      where: { role_id, permission_id },
    });
  }

  // =====================================================
  // GET PERMISSIONS BY ROLE
  // =====================================================
  async getPermissionsByRole(role_id: number): Promise<IRolePermission[]> {
    const rolePermissions = await prisma.role_permissions.findMany({
      where: { role_id },
    });

    return rolePermissions.map((rp: RolePermissionEntity) =>
      mapRolePermission(rp)
    );
  }
}

export const rolePermissionService = new RolePermissionService();