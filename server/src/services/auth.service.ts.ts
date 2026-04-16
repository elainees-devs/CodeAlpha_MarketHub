
import { prisma } from "../utils";
import bcrypt from "bcryptjs";
import { UserResponse, RegisterUserInput } from "../types/interfaces.types";
import { mapUserResponse, UserEntity } from "../mappers/user.mapper";

class AuthService {
  // =====================================================
  // REGISTER USER
  // =====================================================
  async register(input: RegisterUserInput): Promise<UserResponse> {
    const existingUser = await prisma.users.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.users.create({
      data: {
        name: input.name,
        email: input.email,
        password_hash: hashedPassword,
      },
    });

    return mapUserResponse(user as UserEntity);
  }

  // =====================================================
  // LOGIN USER
  // =====================================================
  async login(email: string, password: string): Promise<UserResponse> {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return mapUserResponse(user as UserEntity);
  }

  // =====================================================
  // GET CURRENT USER (optional)
  // =====================================================
  async getMe(user_id: number): Promise<UserResponse | null> {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });

    return user ? mapUserResponse(user as UserEntity) : null;
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================
  async changePassword(
    user_id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: user_id },
      data: {
        password_hash: hashed,
      },
    });
  }
}

export const authService = new AuthService();