import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Configuración de Supabase para el proyecto Rappi
export const supabase = createClient(supabaseUrl, supabaseKey);

// Nota: Para usar PostGIS, asegúrate de habilitar la extensión en Supabase SQL Editor:
// CREATE EXTENSION IF NOT EXISTS postgis;
