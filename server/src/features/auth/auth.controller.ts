import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import { authenticateUserService, createUserService, refreshSessionService } from './auth.service';

export const authenticateUserController = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { email, password } = req.body;

  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  const user = await authenticateUserService({ email, password });
  return res.json(user);
};

export const createUserController = async (req: Request, res: Response) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { email, password, userName } = req.body;

  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  if (userName === undefined) {
    throw Boom.badRequest('User name is required');
  }

  const user = await createUserService({ email, password, userName });
  return res.status(201).json(user);
};

export const refreshSessionController = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw Boom.badRequest('Refresh token is required');
  }

  const data = await refreshSessionService(refresh_token);
  return res.json(data);
};
