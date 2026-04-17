import { ApiError, prisma } from "../utils";
import { IRole } from "../types/interfaces.types";
import { mapRole, RoleEntity } from "../mappers";
import { CreateRoleInput, UpdateRoleInput } from "../schemas";

class RoleService {
  // =====================================================
  // GET ALL ROLES
  // =====================================================
  async getAllRoles(): Promise<IRole[]> {
    const roles = await prisma.roles.findMany({
      orderBy: { created_at: "desc" },
    });

    return roles.map((role) => mapRole(role as RoleEntity));
  }

  // =====================================================
  // GET ROLE BY ID
  // =====================================================
  async getRoleById(id: number): Promise<IRole | null> {
    const role = await prisma.roles.findUnique({
      where: { id },
    });

    return role ? mapRole(role as RoleEntity) : null;
  }

  // =====================================================
  // GET ROLE BY NAME
  // =====================================================
  async getRoleByName(name: string): Promise<IRole | null> {
    const role = await prisma.roles.findUnique({
      where: { name },
    });

    return role ? mapRole(role as RoleEntity) : null;
  }

  // =====================================================
  // CREATE ROLE
  // =====================================================
  async createRole(data: CreateRoleInput): Promise<IRole> {
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

    return mapRole(role as RoleEntity);
  }

  // =====================================================
  // UPDATE ROLE
  // =====================================================
  async updateRole(id: number, data: UpdateRoleInput): Promise<IRole> {
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

    return mapRole(updated as RoleEntity);
  }

  // =====================================================
  // DELETE ROLE
  // =====================================================
  async deleteRole(id: number): Promise<void> {
    const role = await prisma.roles.findUnique({
      where: { id },
    });

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    // Protect system roles
    if (role.name === "admin" || role.name === "superadmin") {
      throw new ApiError(403, "System roles cannot be deleted");
    }

    await prisma.roles.delete({
      where: { id },
    });
  }

  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(user_id: number, role_id: number): Promise<void> {
    const existing = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id,
          role_id,
        },
      },
    });

    if (existing) {
      throw new ApiError(409, "User already has this role");
    }

    await prisma.user_roles.create({
      data: {
        user_id,
        role_id,
      },
    });
  }

  // =====================================================
  // REMOVE ROLE FROM USER
  // =====================================================
  async removeRoleFromUser(user_id: number, role_id: number): Promise<void> {
    const existing = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id,
          role_id,
        },
      },
    });

    if (!existing) {
      throw new ApiError(404, "Role assignment not found");
    }

    await prisma.user_roles.delete({
      where: {
        user_id_role_id: {
          user_id,
          role_id,
        },
      },
    });
  }
}

export const roleService = new RoleService();