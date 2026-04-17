import { prisma } from "../utils";
import { UserResponse, UpdateUserInput } from "../schemas/user.schema";
import { mapUserResponse, UserEntity } from "../mappers/user.mapper";
import bcrypt from "bcryptjs";

class UserService {
  // =====================================================
  // GET ALL USERS
  // =====================================================
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await prisma.users.findMany({
      orderBy: { created_at: "desc" },
    });

    return users.map((user) => mapUserResponse(user as UserEntity));
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
  // UPDATE USER (PROFILE ONLY)
  // =====================================================
  async updateUser(id: number, data: UpdateUserInput): Promise<UserResponse> {
    const { name, email, password } = data;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // If password is provided, hash it before saving
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.users.update({
      where: { id },
      data: updateData,
    });

    return mapUserResponse(user as UserEntity);
  }

  // =====================================================
  // DELETE USER (SOFT DELETE)
  // =====================================================
  async deleteUser(id: number): Promise<void> {
    await prisma.users.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

export const userService = new UserService();
