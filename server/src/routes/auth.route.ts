import { Router } from "express";
import { authController } from "../controllers";
import {
  RegisterSchema,
  LoginSchema,
  ChangePasswordSchema,
  verifyTokenSchema,
} from "../schemas/auth.schema";
import { validate, authenticateMiddleware } from "../middlewares";

const router = Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// REGISTER
router.post("/register", validate(RegisterSchema), (req, res, next) =>
  authController.register(req, res, next),
);

// LOGIN
router.post("/login", validate(LoginSchema), (req, res, next) =>
  authController.login(req, res, next),
);

// VERIFY TOKEN (optional public utility)
router.post("/verify", validate(verifyTokenSchema), (req, res, next) =>
  authController.verifyToken(req, res, next),
);

// =====================================================
// PROTECTED ROUTES
// =====================================================

// GET CURRENT USER
router.get("/me", authenticateMiddleware, (req, res, next) =>
  authController.getMe(req, res, next),
);

// CHANGE PASSWORD
router.patch(
  "/change-password",
  authenticateMiddleware,
  validate(ChangePasswordSchema),
  (req, res, next) => authController.changePassword(req, res, next),
);

// REFRESH TOKEN
router.post("/refresh", authenticateMiddleware, (req, res, next) =>
  authController.refreshToken(req, res, next),
);

export default router;
