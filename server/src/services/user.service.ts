import { prisma, ApiError } from "../utils";
import {
  UserResponse,
  UpdateUserInput,
  DeleteUserInput,
} from "../schemas/user.schema";

import { mapUserResponse, UserEntity } from "../mappers/user.mapper";
import bcrypt from "bcryptjs";
import { auditLogService } from "./auditLog.service";

class UserService {
  // =====================================================
  // GET ALL USERS (PAGINATED)
  // =====================================================
  async getAllUsers(
    page = 1,
    limit = 10
  ): Promise<{
    data: UserResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.users.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      data: users.map((user) =>
        mapUserResponse(user as UserEntity)
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
  // GET USER BY ID
  // =====================================================
  async getUserById(id: number): Promise<UserResponse | null> {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    return user ? mapUserResponse(user as UserEntity) : null;
  }

  // =====================================================
  // GET USER BY EMAIL
  // =====================================================
  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    return user ? mapUserResponse(user as UserEntity) : null;
  }

  // =====================================================
  // UPDATE USER
  // =====================================================
  async updateUser(
    id: number,
    data: UpdateUserInput,
    changed_by?: number,
    session_id?: string
  ): Promise<UserResponse> {
    const exists = await prisma.users.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "User not found");
    }

    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.users.update({
      where: { id },
      data: updateData,
    });

    await auditLogService.createAuditLog({
      table_name: "users",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: updated,
    });

    return mapUserResponse(updated as UserEntity);
  }

  // =====================================================
  // DELETE USER (SOFT DELETE)
  // =====================================================
  async deleteUser(
    data: DeleteUserInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const exists = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (!exists) {
      throw new ApiError(404, "User not found");
    }

    await prisma.users.update({
      where: { id: data.id },
      data: {
        deleted_at: new Date(),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "users",
      record_id: data.id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });
  }
}

export const userService = new UserService();