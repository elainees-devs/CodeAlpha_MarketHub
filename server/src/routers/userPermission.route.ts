import { Router } from "express";
import { userPermissionController } from "../controllers";
import { validate } from "../middlewares";
import {
  AssignUserPermissionSchema,
  RemoveUserPermissionSchema,
} from "../schemas";

const router = Router();

// =====================================================
// ASSIGN PERMISSION TO USER
// =====================================================
router.post(
  "/assign",
  validate(AssignUserPermissionSchema),
  (req, res, next) =>
    userPermissionController.assignPermissionToUser(req, res, next)
);

// =====================================================
// REMOVE PERMISSION FROM USER
// =====================================================
router.post(
  "/remove",
  validate(RemoveUserPermissionSchema),
  (req, res, next) =>
    userPermissionController.removePermissionFromUser(req, res, next)
);

// =====================================================
// GET PERMISSIONS BY USER
// =====================================================
router.get(
  "/user/:user_id",
  (req, res, next) =>
    userPermissionController.getPermissionsByUser(req, res, next)
);

export default router;