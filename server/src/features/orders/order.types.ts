export enum OrderStatus {
  CREADO = "Creado",
  EN_ENTREGA = "En entrega",
  ENTREGADO = "Entregado",
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  delivery_position: LatLng | null;
  destination: LatLng;
  client_id: string;
  delivery_id: string | null;
  created_at: string;
}

export interface CreateOrderDTO {
  destination: LatLng;
}
