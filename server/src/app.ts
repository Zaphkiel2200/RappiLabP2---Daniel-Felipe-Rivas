import express from "express";
import { NODE_ENV, PORT } from "./config";
import cors from "cors";
import { errorsMiddleware } from "./middlewares/errorsMiddleware";
import { router as authRouter } from "./features/auth/auth.router";
import { router as positionsRouter } from "./features/positions/position.router";
import { router as ordersRouter } from "./features/orders/order.router";
import { initDb } from "./config/database";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.options('*', cors());

app.use(express.json());

let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (err) {
      console.error('Error during lazy DB initialization:', err);
    }
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Rappi Maps API is running smoothly",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRouter);
app.use("/api/positions", positionsRouter);
app.use("/api/orders", ordersRouter);

app.use(errorsMiddleware);


if (NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
  });
}

export default app;
