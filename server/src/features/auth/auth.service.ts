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

  return formatAuthResponse(signInResponse.data);
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
