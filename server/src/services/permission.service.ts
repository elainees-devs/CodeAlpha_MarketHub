import { prisma, ApiError } from "../utils";
import {
  CreatePermissionInput,
  UpdatePermissionInput,
} from "../schemas";
import {
  mapPermission,
  mapPermissionResponse,
  PermissionEntity,
} from "../mappers";

class PermissionService {
  // =====================================================
  // GET ALL PERMISSIONS
  // =====================================================
  async getAllPermissions() {
    const permissions = await prisma.permissions.findMany({
      orderBy: { created_at: "desc" },
    });

    return permissions.map((p: PermissionEntity) =>
      mapPermissionResponse(p)
    );
  }

  // =====================================================
  // GET PERMISSION BY ID
  // =====================================================
  async getPermissionById(id: number) {
    const permission = await prisma.permissions.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new ApiError(404, "Permission not found");
    }

    return mapPermission(permission as PermissionEntity);
  }

  // =====================================================
  // CREATE PERMISSION
  // =====================================================
  async createPermission(data: CreatePermissionInput) {
    const permission = await prisma.permissions.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });

    return mapPermission(permission as PermissionEntity);
  }

  // =====================================================
  // UPDATE PERMISSION
  // =====================================================
  async updatePermission(id: number, data: UpdatePermissionInput) {
    const exists = await prisma.permissions.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Permission not found");
    }

    const permission = await prisma.permissions.update({
      where: { id },
      data,
    });

    return mapPermission(permission as PermissionEntity);
  }

  // =====================================================
  // DELETE PERMISSION
  // =====================================================
  async deletePermission(id: number): Promise<void> {
    const exists = await prisma.permissions.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Permission not found");
    }

    await prisma.permissions.delete({
      where: { id },
    });
  }
}

export const permissionService = new PermissionService();