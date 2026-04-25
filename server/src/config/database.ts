import { Pool } from "pg";
import { DATABASE_URL, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./index";

export const pool = DATABASE_URL 
  ? new Pool({ connectionString: DATABASE_URL })
  : new Pool({
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    });

export const initDb = async () => {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS postgis;

    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      user_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.polygons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#6366f1',
      geom GEOGRAPHY(POLYGON, 4326) NOT NULL,
      created_by UUID NOT NULL REFERENCES public.users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.user_positions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES public.users(id),
      position GEOGRAPHY(POINT, 4326) NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.polygon_notifications (
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      polygon_id UUID NOT NULL REFERENCES public.polygons(id) ON DELETE CASCADE,
      notified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, polygon_id)
    );

    CREATE TABLE IF NOT EXISTS public.orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      status TEXT NOT NULL DEFAULT 'Creado',
      client_id UUID NOT NULL REFERENCES auth.users(id),
      delivery_id UUID REFERENCES auth.users(id),
      destination GEOGRAPHY(POINT, 4326) NOT NULL,
      delivery_position GEOGRAPHY(POINT, 4326),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );
  `);
};
