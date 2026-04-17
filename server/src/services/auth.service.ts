import { prisma } from "../utils";
import bcrypt from "bcryptjs";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  UserResponse,
} from "../schemas";
import { mapUserResponse, UserEntity } from "../mappers";

class AuthService {
  // =====================================================
  // REGISTER USER
  // =====================================================
  async register(data: RegisterInput): Promise<UserResponse> {
    const existing = await prisma.users.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("Email already in use");
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: hashed,
      },
    });

    return mapUserResponse(user as UserEntity);
  }

  // =====================================================
  // LOGIN USER
  // =====================================================
  async login(data: LoginInput): Promise<UserResponse> {
    const user = await prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(
      data.password,
      user.password_hash
    );

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return mapUserResponse(user as UserEntity);
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================
  async changePassword(
    user_id: number,
    data: ChangePasswordInput
  ): Promise<void> {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(
      data.old_password,
      user.password_hash
    );

    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    const hashed = await bcrypt.hash(data.new_password, 10);

    await prisma.users.update({
      where: { id: user_id },
      data: {
        password_hash: hashed,
      },
    });
  }

  // =====================================================
  // GET CURRENT USER
  // =====================================================
  async getMe(user_id: number): Promise<UserResponse | null> {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });

    return user ? mapUserResponse(user as UserEntity) : null;
  }

  // =====================================================
  // REFRESH TOKEN
  // =====================================================
  async refreshToken(user_id: number): Promise<UserResponse> {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return mapUserResponse(user as UserEntity);
  }
}

export const authService = new AuthService();