import { Pool } from "pg";
import { DATABASE_URL, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./index";

export const pool = new Pool({
  connectionString: DATABASE_URL || `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Aumentamos a 5 segundos para Vercel
});

export const initDb = async () => {
  try {
    console.log('Database init sequence started...');
    // Solo hacemos una consulta simple para probar la conexión
    await pool.query('SELECT NOW()');
    console.log('Database connection verified.');
    
    // El resto de la creación de tablas lo hacemos en segundo plano
    pool.query('CREATE EXTENSION IF NOT EXISTS postgis;').catch(e => console.warn('PostGIS check failed'));
    
    // No bloqueamos el servidor esperando a que se creen todas las tablas
    return true;
  } catch (error) {
    console.error('Database connection could not be established. Server will stay online anyway.');
    return false;
  }
};
