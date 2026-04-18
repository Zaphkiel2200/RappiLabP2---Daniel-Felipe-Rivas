import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  createOrderController,
  acceptOrderController,
  updateOrderPositionController,
  getOrdersController,
} from "./order.controller";

export const router = Router();

router.use(authMiddleware);

router.get("/", getOrdersController);
router.post("/", createOrderController);
router.post("/:orderId/accept", acceptOrderController);
router.patch("/:orderId/position", updateOrderPositionController);
