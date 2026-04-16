import { ApiError, prisma } from "../utils";
import { IRole } from "../types/interfaces.types";
import { mapRole,RoleEntity } from "../mappers";

class RoleService {
  // =====================================================
  // GET ALL ROLES
  // =====================================================
  async getAllRoles(): Promise<IRole[]> {
    const roles = await prisma.roles.findMany({
      orderBy: { created_at: "desc" },
    });

    return roles.map((role) =>
      mapRole(role as RoleEntity),
    );
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
async createRole(data: {
  name: string;
  description?: string | null;
}): Promise<IRole> {
  // Check if role already exists
  const existingRole = await prisma.roles.findUnique({
    where: { name: data.name },
  });

  if (existingRole) {
    throw new Error(`Role '${data.name}' already exists`);
  }

  // Create role
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
  async updateRole(
    id: number,
    data: Partial<{ name: string; description: string | null }>,
  ): Promise<IRole> {
    const role = await prisma.roles.update({
      where: { id },
      data,
    });

    return mapRole(role as RoleEntity);
  }

// =====================================================
// DELETE ROLE
// =====================================================
async deleteRole(id: number): Promise<void> {
  // Check if role exists
  const role = await prisma.roles.findUnique({
    where: { id },
  });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  // Optional safety check (recommended for RBAC systems)
  if (role.name === "admin" || role.name === "superadmin") {
    throw new ApiError(403, "System roles cannot be deleted");
  }

  // Delete role
  await prisma.roles.delete({
    where: { id },
  });
}

  // =====================================================
  // ASSIGN ROLE TO USER
  // (depends on your user_roles table)
  // =====================================================
  async assignRoleToUser(user_id: number, role_id: number): Promise<void> {
  // check if already exists (avoid duplicate key error)
  const existing = await prisma.user_roles.findUnique({
    where: {
      user_id_role_id: {
        user_id,
        role_id,
      },
    },
  });

  if (existing) {
    throw new Error("User already has this role");
  }

  await prisma.user_roles.create({
    data: {
      user_id,
      role_id,
    },
  });
}

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
    throw new Error("Role assignment not found");
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