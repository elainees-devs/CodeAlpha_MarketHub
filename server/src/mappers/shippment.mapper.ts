import { IShipment, ShippmentStatus } from "../types/interfaces.types";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type ShipmentEntity = {
  id: number;
  order_id: number | null;
  address: string;
  city: string | null;
  phone: string | null;
  status: ShippmentStatus;
  tracking_number: string | null;
  created_at: Date | null;
};

/**
 * Map DB Shipment → API Shipment (IShipment)
 */
export const mapShipment = (shipment: ShipmentEntity): IShipment => {
  return {
    id: shipment.id,
    order_id: shipment.order_id ?? null,
    address: shipment.address,
    city: shipment.city ?? null,
    phone: shipment.phone ?? null,
    status: shipment.status ?? "PENDING",
    tracking_number: shipment.tracking_number ?? null,
    created_at: shipment.created_at?.toISOString() ?? "",
  };
};