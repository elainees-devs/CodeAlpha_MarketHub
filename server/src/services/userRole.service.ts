import { prisma, ApiError } from "../utils";

import {
  UserRoleResponse,
  AssignUserRoleInput,
  RemoveUserRoleInput,
} from "../schemas/userRole.schema";

import { mapUserRole, UserRoleEntity } from "../mappers";
import { auditLogService } from "./auditLog.service";

class UserRoleService {
  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(
    data: AssignUserRoleInput,
    changed_by?: number,
    session_id?: string
  ): Promise<UserRoleResponse> {
    const existing = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: data.user_id,
          role_id: data.role_id,
        },
      },
    });

    if (existing) {
      throw new ApiError(409, "User already has this role");
    }

    const result = await prisma.user_roles.create({
      data: {
        user_id: data.user_id,
        role_id: data.role_id,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "user_roles",
      record_id: result.user_id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: result,
    });

    return mapUserRole(result as UserRoleEntity);
  }

  // =====================================================
  // REMOVE ROLE FROM USER
  // =====================================================
  async removeRoleFromUser(
    data: RemoveUserRoleInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const existing = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: data.user_id,
          role_id: data.role_id,
        },
      },
    });

    if (!existing) {
      throw new ApiError(404, "Role assignment not found");
    }

    await prisma.user_roles.delete({
      where: {
        user_id_role_id: {
          user_id: data.user_id,
          role_id: data.role_id,
        },
      },
    });

    await auditLogService.createAuditLog({
      table_name: "user_roles",
      record_id: data.user_id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: existing,
      new_data: null,
    });
  }

  // =====================================================
  // GET ROLES BY USER (PAGINATED)
  // =====================================================
  async getRolesByUser(
    user_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    data: UserRoleResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
      prisma.user_roles.findMany({
        where: { user_id },
        skip,
        take: limit,
      }),
      prisma.user_roles.count({
        where: { user_id },
      }),
    ]);

    return {
      data: roles.map((r) =>
        mapUserRole(r as UserRoleEntity)
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

export const userRoleService = new UserRoleService();