// Role and user role related mappers
export { RoleEntity, mapRole } from "./role.mapper";
export { UserRoleEntity, mapUserRole } from "./userRole.mapper";

// Permission related mappers
export {
  PermissionEntity,
  mapPermission,
  mapPermissionResponse,
  mapRolePermission,
  RolePermissionEntity,
  UserPermissionEntity,
  mapUserPermission,
} from "./permission.mapper";

// Audit log related mappers
export { AuditLogEntity, IAuditLog, mapAuditLog } from "./auditLog.mapper";

//User and Auth-related mappers
export {
  UserEntity,
  mapUser,
  mapUserResponse,
  AuthEntity,
  mapAuthUser,
  mapAuthUserResponse,
} from "./user.mapper";

// Product and product image related mappers
export {
  ProductEntity,
  mapProduct,
  mapProductResponse,
  mapProductImage,
} from "./product.mapper";

// Discount related mappers
export { DiscountEntity, mapDiscount } from "./discount.mapper";

// Category and subcategory related mappers
export {
  CategoryEntity,
  mapCategory,
  mapCategoryResponse,
} from "./category.mapper";
export {
  SubcategoryEntity,
  mapSubcategory,
  mapSubcategoryResponse,
} from "./subcategory.mapper";

// Order and order item related mappers

export { OrderEntity, mapOrder } from "./order.mapper";
export { OrderItemEntity, mapOrderItem } from "./orderItem.mapper";

// Cart and cart item related mappers
export { CartEntity, mapCart } from "./cart.mapper";
export { CartItemEntity, mapCartItem } from "./cartItem.mapper";

// Payment related mappers
export { PaymentEntity, mapPayment } from "./payment.mapper";

// Shipment related mappers
export { ShipmentEntity, mapShipment } from "./shipment.mapper";
