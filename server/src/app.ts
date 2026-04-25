import express from "express";
import cors from "cors";
import { errorsMiddleware } from "./middlewares/errorsMiddleware";
import { router as authRouter } from "./features/auth/auth.router";
import { router as positionsRouter } from "./features/positions/position.router";
import { router as ordersRouter } from "./features/orders/order.router";
import { initDb } from "./config/database";

const app = express();

// Configuración de CORS ultra-explícita
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.options('*', cors());
app.use(express.json());

// Middleware de inicialización diferida - NO BLOQUEANTE
let dbInitialized = false;
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  
  if (!dbInitialized) {
    initDb().then(() => {
      dbInitialized = true;
      console.log('Database initialized');
    }).catch(err => console.error('DB Init Error:', err));
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Rappi Maps API is running",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/positions", positionsRouter);
app.use("/api/orders", ordersRouter);

// Error handling
app.use(errorsMiddleware);

export default app;
