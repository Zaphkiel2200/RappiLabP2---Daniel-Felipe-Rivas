import { Request, Response } from "express";
import { getUserFromRequest } from "../../middlewares/authMiddleware";
import {
  createOrderService,
  acceptOrderService,
  updateDeliveryPositionService,
  getOrdersService,
} from "./order.service";

export const createOrderController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const order = await createOrderService(user.id, req.body);
  return res.status(201).json(order);
};

export const acceptOrderController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const orderId = req.params.orderId as string;
  const order = await acceptOrderService(orderId, user.id);
  return res.json(order);
};

export const updateOrderPositionController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const orderId = req.params.orderId as string;
  const order = await updateDeliveryPositionService(orderId, user.id, req.body);
  return res.json(order);
};

export const getOrdersController = async (req: Request, res: Response) => {
  const orders = await getOrdersService();
  return res.json(orders);
};
