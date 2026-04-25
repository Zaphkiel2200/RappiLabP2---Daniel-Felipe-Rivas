import express from "express";
import cors from "cors";
import { initDb } from "./config/database";

// Importamos tus rutas reales
import { router as authRouter } from "./features/auth/auth.router";
import { router as positionsRouter } from "./features/positions/position.router";
import { router as ordersRouter } from "./features/orders/order.router";
import { errorsMiddleware } from "./middlewares/errorsMiddleware";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(express.json());

// Diagnóstico
app.get("/", (req, res) => {
  res.json({ status: "online", message: "Rappi Maps API Real Online" });
});

// Inicialización de DB segura
let dbInitialized = false;
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  if (!dbInitialized) {
    initDb().then(() => { dbInitialized = true; });
  }
  next();
});

// RUTAS REALES (Activadas)
app.use("/api/auth", authRouter);
app.use("/api/positions", positionsRouter);
app.use("/api/orders", ordersRouter);

app.options('*', cors());
app.use(errorsMiddleware);

export default app;
