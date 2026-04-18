// Definiciones de tipos globales para la aplicación Rappi

export interface User {
  id: string;
  email: string;
  userName: string; // Adjusted from root providers usage
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

// New types from root providers
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

export interface PolygonEnteredPayload {
  userName: string;
  polygonName: string;
  ownerId: string;
}
