import { Router } from "express";
import { userController } from "../controllers";
import { validate } from "../middlewares";
import { UpdateUserSchema } from "../schemas/user.schema";

const router = Router();

// =====================================================
// GET ALL USERS
// =====================================================
router.get("/", (req, res, next) =>
  userController.getAllUsers(req, res, next)
);

// =====================================================
// GET USER BY ID
// =====================================================
router.get("/:id", (req, res, next) =>
  userController.getUserById(req, res, next)
);

// =====================================================
// GET USER BY EMAIL
// (example: /email/test@gmail.com)
// =====================================================
router.get("/email/:email", (req, res, next) =>
  userController.getUserByEmail(req, res, next)
);

// =====================================================
// UPDATE USER
// =====================================================
router.put(
  "/:id",
  validate(UpdateUserSchema),
  (req, res, next) => userController.updateUser(req, res, next)
);

// =====================================================
// DELETE USER (SOFT DELETE)
// =====================================================
router.delete("/:id", (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;