import { Router } from "express";

import authRouter from "./auth.route";
import permissionRouter from "./permission.route";
import userPermissionRouter from "./userPermission.route";
import roleRouter from "./role.route";
import userRoleRouter from "./userRole.route";

import auditLogRouter from "./auditLog.route";
import userRouter from "./user.route";

import categoryRouter from "./category.route";
import subcategoryRouter from "./subCategory.route";
import discountRouter from "./discount.route";
import productRouter from "./product.route";

import cartRouter from "./cart.route";
import cartItemRouter from "./cartItem.route";
import orderRouter from "./order.route";
import orderItemRouter from "./orderItem.route";

import shipmentRouter from "./shipment.route";
import paymentRouter from "./payment.route";

const routes = Router();

// ======================
// REGISTER ROUTES
// ======================
routes.use("/auth", authRouter);

routes.use("/permissions", permissionRouter);
routes.use("/user-permissions", userPermissionRouter);
routes.use("/roles", roleRouter);
routes.use("/user-roles", userRoleRouter);

routes.use("/audit-logs", auditLogRouter);

routes.use("/users", userRouter);

routes.use("/categories", categoryRouter);
routes.use("/subcategories", subcategoryRouter);
routes.use("/discounts", discountRouter);
routes.use("/products", productRouter);

routes.use("/cart", cartRouter);
routes.use("/cart-items", cartItemRouter);
routes.use("/orders", orderRouter);
routes.use("/order-items", orderItemRouter);

routes.use("/shipments", shipmentRouter);
routes.use("/payments", paymentRouter);

export default routes;