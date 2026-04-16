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

//User-related mappers
export { UserEntity, mapUser } from "./user.mapper";

// Product and product image related mappers
export {
  ProductEntity,
  mapProduct,
  mapProductResponse,
  mapProductImage,
} from "./product.mapper";

// Category and subcategory related mappers
export { CategoryEntity, mapCategory } from "./category.mapper";
export {
  SubcategoryEntity,
  mapSubcategory,
  mapSubcategoryResponse,
} from "./subcategory.mapper";

// Order and order item related mappers

export { OrderEntity, mapOrder } from "./order.mapper";
export { OrderItemEntity, mapOrderItem } from "./orderItem.mapper";

// Payment related mappers
export { PaymentEntity, mapPayment } from "./payment.mapper";

// Shipment related mappers
export { ShipmentEntity, mapShipment } from "./shipment.mapper";
