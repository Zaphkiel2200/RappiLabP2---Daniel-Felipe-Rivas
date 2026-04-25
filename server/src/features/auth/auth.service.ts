import { AuthenticateUserDTO, CreateUserDTO } from './auth.types';
import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';
import { AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

const formatAuthResponse = (data: any) => {
  if (!data.user) return data;
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      userName: data.user.user_metadata?.userName || '',
      role: data.user.user_metadata?.role || 'client',
    },
    session: data.session,
  };
};

export const authenticateUserService = async (
  credentials: AuthenticateUserDTO
) => {
  const signInResponse = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (signInResponse.error) {
    throw Boom.unauthorized(signInResponse.error.message);
  }

  const { pool } = await import('../../config/database');
  const result = await pool.query(
    'SELECT id, email, user_name as "userName", role FROM public.users WHERE id = $1',
    [signInResponse.data.user.id]
  );

  if (result.rows.length === 0) {
    await pool.query(
      'INSERT INTO public.users (id, email, user_name, role) VALUES ($1, $2, $3, $4)',
      [
        signInResponse.data.user.id, 
        signInResponse.data.user.email, 
        signInResponse.data.user.user_metadata?.userName || 'Usuario',
        signInResponse.data.user.user_metadata?.role || 'client'
      ]
    );
    return formatAuthResponse(signInResponse.data);
  }

  const dbUser = result.rows[0];
  return {
    user: dbUser,
    session: signInResponse.data.session,
  };
};

export const createUserService = async (
  user: CreateUserDTO
) => {
  const signUpResponse = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        userName: user.userName,
      },
    },
  });

  if (signUpResponse.error) {
    throw Boom.badRequest(signUpResponse.error.message);
  }

  if (signUpResponse.data.user) {
    const { pool } = await import('../../config/database');
    await pool.query(
      'INSERT INTO public.users (id, email, user_name, role) VALUES ($1, $2, $3, $4)',
      [
        signUpResponse.data.user.id, 
        user.email, 
        user.userName, 
        'client' // Rol por defecto
      ]
    ).catch(err => console.error('Error al insertar en public.users:', err));
  }

  return formatAuthResponse(signUpResponse.data);
};

export const refreshSessionService = async (refreshToken: string) => {
  const refreshResponse = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (refreshResponse.error || !refreshResponse.data.session) {
    throw Boom.unauthorized(refreshResponse.error?.message ?? 'Invalid refresh token');
  }

  return formatAuthResponse(refreshResponse.data);
};
