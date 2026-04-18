import { prisma, ApiError } from "../utils";

import {
  RolePermissionResponse,
  AssignRolePermissionInput,
  RemoveRolePermissionInput,
} from "../schemas/rolePermission.schema";

import { mapRolePermission } from "../mappers";

import { auditLogService } from "./auditLog.service";

class RolePermissionService {
  // =====================================================
  // ASSIGN PERMISSION TO ROLE
  // =====================================================
  async assignPermissionToRole(
    data: AssignRolePermissionInput,
    changed_by?: number,
    session_id?: string
  ): Promise<RolePermissionResponse> {
    const exists = await prisma.role_permissions.findUnique({
      where: {
        role_id_permission_id: {
          role_id: data.role_id,
          permission_id: data.permission_id,
        },
      },
    });

    if (exists) {
      throw new ApiError(409, "Permission already assigned to role");
    }

    const rp = await prisma.role_permissions.create({
      data: {
        role_id: data.role_id,
        permission_id: data.permission_id,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "role_permissions",
      record_id: rp.role_id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: rp,
    });

    return mapRolePermission(rp);
  }

  // =====================================================
  // REMOVE PERMISSION FROM ROLE
  // =====================================================
  async removePermissionFromRole(
    data: RemoveRolePermissionInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const exists = await prisma.role_permissions.findUnique({
      where: {
        role_id_permission_id: {
          role_id: data.role_id,
          permission_id: data.permission_id,
        },
      },
    });

    if (!exists) {
      throw new ApiError(404, "Role permission not found");
    }

    await prisma.role_permissions.delete({
      where: {
        role_id_permission_id: {
          role_id: data.role_id,
          permission_id: data.permission_id,
        },
      },
    });

    await auditLogService.createAuditLog({
      table_name: "role_permissions",
      record_id: data.role_id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });
  }

  // =====================================================
  // GET PERMISSIONS BY ROLE (PAGINATED)
  // =====================================================
  async getPermissionsByRole(
    role_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    data: RolePermissionResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [rolePermissions, total] = await Promise.all([
      prisma.role_permissions.findMany({
        where: { role_id },
        skip,
        take: limit,
        orderBy: { role_id: "desc" },
      }),
      prisma.role_permissions.count({
        where: { role_id },
      }),
    ]);

    return {
      data: rolePermissions.map((rp) =>
        mapRolePermission(rp)
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const rolePermissionService = new RolePermissionService();