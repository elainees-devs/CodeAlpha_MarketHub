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
import { auditLogService } from "./auditLog.service";

class PermissionService {
  // =====================================================
  // GET ALL PERMISSIONS (PAGINATED)
  // =====================================================
  async getAllPermissions(
    page = 1,
    limit = 10
  ): Promise<{
    data: ReturnType<typeof mapPermissionResponse>[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [permissions, total] = await Promise.all([
      prisma.permissions.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.permissions.count(),
    ]);

    return {
      data: permissions.map((p: PermissionEntity) =>
        mapPermissionResponse(p)
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
  async createPermission(
    data: CreatePermissionInput,
    changed_by?: number,
    session_id?: string
  ) {
    const permission = await prisma.permissions.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "permissions",
      record_id: permission.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: permission,
    });

    return mapPermission(permission as PermissionEntity);
  }

  // =====================================================
  // UPDATE PERMISSION
  // =====================================================
  async updatePermission(
    id: number,
    data: UpdatePermissionInput,
    changed_by?: number,
    session_id?: string
  ) {
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

    await auditLogService.createAuditLog({
      table_name: "permissions",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: permission,
    });

    return mapPermission(permission as PermissionEntity);
  }

  // =====================================================
  // DELETE PERMISSION
  // =====================================================
  async deletePermission(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const exists = await prisma.permissions.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Permission not found");
    }

    await prisma.permissions.delete({
      where: { id },
    });

    await auditLogService.createAuditLog({
      table_name: "permissions",
      record_id: id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });
  }
}

export const permissionService = new PermissionService();