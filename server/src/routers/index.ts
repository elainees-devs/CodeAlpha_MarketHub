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

// =====================================================
// SINGLE EXPORT OBJECT
// =====================================================
const routers = {
  authRouter,

  permissionRouter,
  userPermissionRouter,
  roleRouter,
  userRoleRouter,

  auditLogRouter,

  userRouter,

  categoryRouter,
  subcategoryRouter,
  discountRouter,
  productRouter,

  cartRouter,
  cartItemRouter,
  orderRouter,
  orderItemRouter,

  shipmentRouter,
  paymentRouter,
};

export default routers;