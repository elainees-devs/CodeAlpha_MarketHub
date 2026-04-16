import { prisma } from "../utils";
import { IShipment, ShipmentStatus } from "../types/interfaces.types";
import { mapShipment, ShipmentEntity } from "../mappers";

class ShipmentService {
  // =====================================================
  // CREATE SHIPMENT
  // =====================================================
  async createShipment(data: {
    order_id?: number;
    address: string;
    city?: string;
    phone?: string;
  }): Promise<IShipment> {
    const shipment = await prisma.shipments.create({
      data: {
        order_id: data.order_id ?? null,
        address: data.address,
        city: data.city ?? null,
        phone: data.phone ?? null,
        status: "PENDING",
      },
    });

    return mapShipment(shipment as ShipmentEntity);
  }

  // =====================================================
  // GET SHIPMENT BY ID
  // =====================================================
  async getShipmentById(id: number): Promise<IShipment> {
    const shipment = await prisma.shipments.findUnique({
      where: { id },
    });

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    return mapShipment(shipment as ShipmentEntity);
  }

  // =====================================================
  // GET ALL SHIPMENTS
  // =====================================================
  async getAllShipments(): Promise<IShipment[]> {
    const shipments = await prisma.shipments.findMany({
      orderBy: { created_at: "desc" },
    });

    return shipments.map((s) => mapShipment(s as ShipmentEntity));
  }

  // =====================================================
  // UPDATE SHIPMENT STATUS
  // =====================================================
  async updateShipmentStatus(
    id: number,
    status: ShipmentStatus
  ): Promise<IShipment> {
    const shipment = await prisma.shipments.update({
      where: { id },
      data: { status },
    });

    return mapShipment(shipment as ShipmentEntity);
  }

  // =====================================================
  // DELETE SHIPMENT
  // =====================================================
  async deleteShipment(id: number): Promise<{ message: string }> {
    await prisma.shipments.delete({
      where: { id },
    });

    return { message: "Shipment deleted successfully" };
  }
}

export default new ShipmentService();
