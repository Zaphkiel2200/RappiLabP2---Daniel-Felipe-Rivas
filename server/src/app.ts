import express from "express";
import { NODE_ENV, PORT } from "./config";
import cors from "cors";
import { errorsMiddleware } from "./middlewares/errorsMiddleware";
import { router as authRouter } from "./features/auth/auth.router";
import { router as positionsRouter } from "./features/positions/position.router";
import { router as ordersRouter } from "./features/orders/order.router";
import { initDb } from "./config/database";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Rappi Maps API is running smoothly",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/positions", positionsRouter);
app.use("/api/orders", ordersRouter);

// Error handling middleware
app.use(errorsMiddleware);

const start = async () => {
  try {
    await initDb();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }

  if (NODE_ENV !== "production") {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  }
};

start();

export default app;
