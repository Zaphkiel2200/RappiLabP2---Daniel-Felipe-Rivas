import { pool } from "../../config/database";
import { supabase } from "../../config/supabase";
import { Order, OrderStatus, CreateOrderDTO, LatLng } from "./order.types";
import Boom from "@hapi/boom";

export const createOrderService = async (
  clientId: string,
  dto: CreateOrderDTO,
): Promise<Order> => {
  const result = await pool.query(
    `
    INSERT INTO public.orders (client_id, destination)
    VALUES ($1, ST_MakePoint($2, $3)::geography)
    RETURNING
      id,
      status,
      ST_Y(delivery_position::geometry) AS delivery_lat,
      ST_X(delivery_position::geometry) AS delivery_lng,
      ST_Y(destination::geometry) AS dest_lat,
      ST_X(destination::geometry) AS dest_lng,
      client_id,
      delivery_id,
      created_at
    `,
    [clientId, dto.destination.lng, dto.destination.lat],
  );

  const row = result.rows[0];
  const order = mapRowToOrder(row);

  return order;
};

export const acceptOrderService = async (
  orderId: string,
  deliveryId: string,
): Promise<Order> => {
  const result = await pool.query(
    `
    UPDATE public.orders
    SET status = $1, delivery_id = $2
    WHERE id = $3 AND status = $4
    RETURNING
      id,
      status,
      ST_Y(delivery_position::geometry) AS delivery_lat,
      ST_X(delivery_position::geometry) AS delivery_lng,
      ST_Y(destination::geometry) AS dest_lat,
      ST_X(destination::geometry) AS dest_lng,
      client_id,
      delivery_id,
      created_at
    `,
    [OrderStatus.EN_ENTREGA, deliveryId, orderId, OrderStatus.CREADO],
  );

  if (result.rows.length === 0) {
    throw Boom.notFound("Order not found or already accepted");
  }

  const order = mapRowToOrder(result.rows[0]);
  return order;
};

export const updateDeliveryPositionService = async (
  orderId: string,
  deliveryId: string,
  pos: LatLng,
): Promise<Order> => {
  // Update position and check if arrived (< 5 meters)
  const result = await pool.query(
    `
    WITH updated AS (
      UPDATE public.orders
      SET delivery_position = ST_MakePoint($1, $2)::geography
      WHERE id = $3 AND delivery_id = $4
      RETURNING *
    )
    UPDATE public.orders
    SET status = CASE 
      WHEN ST_DWithin(delivery_position, destination, 5) THEN $5::text
      ELSE status
    END
    FROM updated
    WHERE public.orders.id = updated.id
    RETURNING
      public.orders.id,
      public.orders.status,
      ST_Y(public.orders.delivery_position::geometry) AS delivery_lat,
      ST_X(public.orders.delivery_position::geometry) AS delivery_lng,
      ST_Y(public.orders.destination::geometry) AS dest_lat,
      ST_X(public.orders.destination::geometry) AS dest_lng,
      public.orders.client_id,
      public.orders.delivery_id,
      public.orders.created_at
    `,
    [pos.lng, pos.lat, orderId, deliveryId, OrderStatus.ENTREGADO],
  );

  if (result.rows.length === 0) {
    throw Boom.notFound("Order not found or not assigned to you");
  }

  const order = mapRowToOrder(result.rows[0]);
  return order;
};

export const getOrdersService = async (): Promise<Order[]> => {
  const result = await pool.query(`
    SELECT
      id,
      status,
      ST_Y(delivery_position::geometry) AS delivery_lat,
      ST_X(delivery_position::geometry) AS delivery_lng,
      ST_Y(destination::geometry) AS dest_lat,
      ST_X(destination::geometry) AS dest_lng,
      client_id,
      delivery_id,
      created_at
    FROM public.orders
    ORDER BY created_at DESC
  `);

  return result.rows.map(mapRowToOrder);
};

const mapRowToOrder = (row: any): Order => ({
  id: row.id,
  status: row.status as OrderStatus,
  delivery_position: row.delivery_lat ? { lat: row.delivery_lat, lng: row.delivery_lng } : null,
  destination: { lat: row.dest_lat, lng: row.dest_lng },
  client_id: row.client_id,
  delivery_id: row.delivery_id,
  created_at: row.created_at,
});


