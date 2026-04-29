import { IShipment } from "../types/interfaces.types";
import { ShipmentStatus } from "../utils/constants";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type ShipmentEntity = {
  id: number;
  order_id: number;
  address: string;
  city: string;
  phone: string;
  status: ShipmentStatus;
  tracking_number: string;
  created_at: Date;
};

/**
 * Map DB Shipment → API Shipment (IShipment)
 */
export const mapShipment = (shipment: ShipmentEntity): IShipment => {
  return {
    id: shipment.id,
    order_id: shipment.order_id,
    address: shipment.address,
    city: shipment.city,
    phone: shipment.phone,
    status: shipment.status,
    tracking_number: shipment.tracking_number,
    created_at: shipment.created_at,
  };
};