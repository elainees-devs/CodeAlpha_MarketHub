import { prisma, ApiError } from "../utils";

import {
  UserPermissionResponse,
  AssignUserPermissionInput,
  RemoveUserPermissionInput,
} from "../schemas/userPermission.schema";

import {
  mapUserPermission,
  UserPermissionEntity,
} from "../mappers";

import { auditLogService } from "./auditLog.service";

class UserPermissionService {
  // =====================================================
  // ASSIGN PERMISSION TO USER
  // =====================================================
  async assignPermissionToUser(
    data: AssignUserPermissionInput,
    changed_by?: number,
    session_id?: string
  ): Promise<UserPermissionResponse> {
    const existing = await prisma.user_permissions.findUnique({
      where: {
        user_id_permission_id: {
          user_id: data.user_id,
          permission_id: data.permission_id,
        },
      },
    });

    if (existing) {
      throw new ApiError(409, "User already has this permission");
    }

    const result = await prisma.user_permissions.create({
      data: {
        user_id: data.user_id,
        permission_id: data.permission_id,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "user_permissions",
      record_id: result.user_id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: result,
    });

    return mapUserPermission(result as UserPermissionEntity);
  }

  // =====================================================
  // REMOVE PERMISSION FROM USER
  // =====================================================
  async removePermissionFromUser(
    data: RemoveUserPermissionInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const existing = await prisma.user_permissions.findUnique({
      where: {
        user_id_permission_id: {
          user_id: data.user_id,
          permission_id: data.permission_id,
        },
      },
    });

    if (!existing) {
      throw new ApiError(404, "User permission not found");
    }

    await prisma.user_permissions.delete({
      where: {
        user_id_permission_id: {
          user_id: data.user_id,
          permission_id: data.permission_id,
        },
      },
    });

    await auditLogService.createAuditLog({
      table_name: "user_permissions",
      record_id: data.user_id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: existing,
      new_data: null,
    });
  }

  // =====================================================
  // GET PERMISSIONS BY USER (PAGINATED)
  // =====================================================
  async getPermissionsByUser(
    user_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    data: UserPermissionResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [permissions, total] = await Promise.all([
      prisma.user_permissions.findMany({
        where: { user_id },
        skip,
        take: limit,
      }),
      prisma.user_permissions.count({
        where: { user_id },
      }),
    ]);

    return {
      data: permissions.map((p) =>
        mapUserPermission(p as UserPermissionEntity)
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

export const userPermissionService = new UserPermissionService();