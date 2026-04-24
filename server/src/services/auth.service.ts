import { ApiError, generateToken, prisma } from "../utils";
import bcrypt from "bcryptjs";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  UserResponse,
} from "../schemas";
import { mapAuthUserResponse, AuthEntity } from "../mappers";

class AuthService {
  /**
   * Prisma include object to traverse the join table:
   * users -> user_roles -> roles
   */
  private userInclude = {
    user_roles: {
      include: {
        roles: true,
      },
    },
  };

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
      include: this.userInclude, // Include nested roles after creation
    });

    return mapAuthUserResponse(user as unknown as AuthEntity);
  }

  // =====================================================
// LOGIN USER
// =====================================================
async login(data: LoginInput) {
  const user = await prisma.users.findUnique({
  where: { email: data.email },
  include: {
    user_roles: {
      include: {
        roles: true,
      },
    },
  },
});

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(
    data.password,
    user.password_hash
  );

  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }
 const roles = user.user_roles.map((ur) => ur.roles.name);
  const token = generateToken({
    id: user.id,
    email: user.email,
    roles,
  });

  

  return {
    user: mapAuthUserResponse(user as unknown as AuthEntity),
    token,
  };
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

    const isMatch = await bcrypt.compare(data.old_password, user.password_hash);

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
      include: this.userInclude,
    });

    return user ? mapAuthUserResponse(user as unknown as AuthEntity) : null;
  }

  // =====================================================
  // REFRESH TOKEN
  // =====================================================
  async refreshToken(user_id: number): Promise<UserResponse> {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
      include: this.userInclude,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return mapAuthUserResponse(user as unknown as AuthEntity);
  }
}

export const authService = new AuthService();