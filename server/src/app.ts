import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(express.json());

// Ruta de diagnóstico
app.get("/", (req, res) => {
  res.json({ status: "online", message: "Servidor de Emergencia Activo" });
});

// Rutas de emergencia para que la web no explote
app.post("/api/auth/login", (req, res) => {
  console.log("Login attempt:", req.body);
  res.json({ 
    user: { id: "1", email: req.body.email, name: "Usuario de Prueba" },
    session: { access_token: "fake-token" }
  });
});

app.post("/api/auth/register", (req, res) => {
  console.log("Register attempt:", req.body);
  res.json({ 
    user: { id: "1", email: req.body.email, name: req.body.name },
    session: { access_token: "fake-token" }
  });
});

// Ruta para CORS
app.options('*', cors());

export default app;
