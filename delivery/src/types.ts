// Definiciones de tipos globales para la aplicación Rappi

export interface User {
  id: string;
  email: string;
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
