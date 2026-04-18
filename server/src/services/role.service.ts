import { ApiError, prisma } from "../utils";
import {
  CreateRoleInput,
  UpdateRoleInput,
  DeleteRoleInput,
  RoleResponse,
} from "../schemas/role.schema";

import { mapRole, RoleEntity } from "../mappers";
import { auditLogService } from "./auditLog.service";

class RoleService {
  // =====================================================
  // GET ALL ROLES (PAGINATED)
  // =====================================================
  async getAllRoles(page = 1, limit = 10): Promise<{
    data: RoleResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
      prisma.roles.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.roles.count(),
    ]);

    return {
      data: roles.map((r) => mapRole(r as RoleEntity)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // GET ROLE BY ID
  // =====================================================
  async getRoleById(id: number): Promise<RoleResponse | null> {
    const role = await prisma.roles.findUnique({
      where: { id },
    });

    return role ? mapRole(role as RoleEntity) : null;
  }

  // =====================================================
  // GET ROLE BY NAME
  // =====================================================
  async getRoleByName(name: string): Promise<RoleResponse | null> {
    const role = await prisma.roles.findUnique({
      where: { name },
    });

    return role ? mapRole(role as RoleEntity) : null;
  }

  // =====================================================
  // CREATE ROLE
  // =====================================================
  async createRole(
    data: CreateRoleInput,
    changed_by?: number,
    session_id?: string
  ): Promise<RoleResponse> {
    const existingRole = await prisma.roles.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new ApiError(409, `Role '${data.name}' already exists`);
    }

    const role = await prisma.roles.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "roles",
      record_id: role.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: role,
    });

    return mapRole(role as RoleEntity);
  }

  // =====================================================
  // UPDATE ROLE
  // =====================================================
  async updateRole(
    id: number,
    data: UpdateRoleInput,
    changed_by?: number,
    session_id?: string
  ): Promise<RoleResponse> {
    const role = await prisma.roles.findUnique({
      where: { id },
    });

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    const updated = await prisma.roles.update({
      where: { id },
      data,
    });

    await auditLogService.createAuditLog({
      table_name: "roles",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: role,
      new_data: updated,
    });

    return mapRole(updated as RoleEntity);
  }

  // =====================================================
  // DELETE ROLE (USES DELETE INPUT)
  // =====================================================
  async deleteRole(
    data: DeleteRoleInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const role = await prisma.roles.findUnique({
      where: { id: data.id },
    });

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    if (role.name === "admin" || role.name === "superadmin") {
      throw new ApiError(403, "System roles cannot be deleted");
    }

    await prisma.roles.delete({
      where: { id: data.id },
    });

    await auditLogService.createAuditLog({
      table_name: "roles",
      record_id: data.id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: role,
      new_data: null,
    });
  }

  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(
    user_id: number,
    role_id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const existing = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: { user_id, role_id },
      },
    });

    if (existing) {
      throw new ApiError(409, "User already has this role");
    }

    await prisma.user_roles.create({
      data: { user_id, role_id },
    });

    await auditLogService.createAuditLog({
      table_name: "user_roles",
      record_id: role_id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: { user_id, role_id },
    });
  }

  // =====================================================
  // REMOVE ROLE FROM USER
  // =====================================================
  async removeRoleFromUser(
    user_id: number,
    role_id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
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

    await auditLogService.createAuditLog({
      table_name: "user_roles",
      record_id: role_id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: existing,
      new_data: null,
    });
  }
}

export const roleService = new RoleService();