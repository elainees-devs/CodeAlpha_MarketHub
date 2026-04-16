import { prisma } from "../utils";
import { UserResponse, IUser } from "../types/interfaces.types";
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

    return users.map((user) =>
      mapUserResponse(user as UserEntity),
    );
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
  async updateUser(
    id: number,
    data: Partial<Pick<IUser, "name" | "email">>,
  ): Promise<UserResponse> {
    const user = await prisma.users.update({
      where: { id },
      data,
    });

    return mapUserResponse(user as UserEntity);
  }

  // =====================================================
  // CHANGE PASSWORD (SECURE OPERATION)
  // =====================================================
  async changePassword(
    user_id: number,
    data: { oldPassword: string; newPassword: string },
  ): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(
      data.oldPassword,
      user.password_hash,
    );

    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(
      data.newPassword,
      10,
    );

    await prisma.users.update({
      where: { id: user_id },
      data: {
        password_hash: hashedPassword,
      },
    });
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