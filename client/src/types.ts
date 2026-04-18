// Definiciones de tipos globales para la aplicación Rappi

export const OrderStatus = {
  CREADO: "Creado",
  EN_ENTREGA: "En entrega",
  ENTREGADO: "Entregado",
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export interface User {
  id: string;
  email: string;
  userName: string;
  full_name?: string;
  avatar_url?: string;
  role: 'client' | 'driver' | 'admin';
}

export interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  rating: number;
  delivery_time: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface AuthData {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  };
}

export interface UserPosition {
  user_id: string;
  user: {
    userName: string;
  };
  latitude: number;
  longitude: number;
}

export interface Order {
  id: string;
  status: OrderStatusType;
  delivery_position: LatLng | null;
  destination: LatLng;
  client_id: string;
  delivery_id: string | null;
  created_at: string;
}
