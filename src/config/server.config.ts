import express from "express";
import cors from "cors";

// === Rutas originales ===
import serviciosRoutes from "../routes/servicios.routes";

// === Rutas nuevas desde el PR ===
import registrarDatosRouter from "../api/routes/userManagement/registrarDatos.routes";
import fotoPerfilRouter from "../api/routes/userManagement/fotoPerfil.routes";
import googleRouter from "../api/routes/userManagement/google.routes";
import ubicacionRouter from "../api/routes/userManagement/ubicacion.routes";
import authRouter from "../api/routes/userManagement/login.routes";
import modificarDatosRouter from "../api/routes/userManagement/modificarDatos.routes";
import nominatimRouter from "../api/routes/userManagement/sugerencias.routes";
import deviceRouter from "../api/routes/userManagement/device.routes";
import cambiarContrasenaRouter from "../api/routes/userManagement/editarContraseña.routes";
import cerrarSesionesRouter from "../api/routes/userManagement/cerrarSesiones.routes";
import ultimoCambioRouter from "../api/routes/userManagement/ultimoCambio.routes";
import githubAuthRouter from "../api/routes/userManagement/github.routes";
import discordRoutes from "../api/routes/userManagement/discord.routes";
import clienteRouter from "../api/routes/userManagement/cliente.routes";
import obtenerContrasenaRouter from "../api/routes/userManagement/obtener.routes";

const app = express();

app.use(cors());
app.use(express.json());

// ========================
//     Rutas originales
// ========================
app.use("/api/newoffers", serviciosRoutes);

// ========================
//     Rutas del PR
// ========================
app.use("/api/controlC/google", googleRouter);
app.use("/api/controlC/ubicacion", ubicacionRouter);
app.use("/api/controlC/auth", authRouter);
app.use("/api/controlC/registro", registrarDatosRouter);
app.use("/api/controlC/modificar-datos", modificarDatosRouter);
app.use("/api/controlC/sugerencias", nominatimRouter);
app.use("/api/controlC/cambiar-contrasena", cambiarContrasenaRouter);
app.use("/api/controlC/cerrar-sesiones", cerrarSesionesRouter);
app.use("/api/controlC/ultimo-cambio", ultimoCambioRouter);
app.use("/api/controlC/foto-perfil", fotoPerfilRouter);
app.use("/api/controlC/obtener-password", obtenerContrasenaRouter);

app.use("/auth", githubAuthRouter);
app.use("/auth", discordRoutes);

app.use("/api/controlC/cliente", clienteRouter);

app.use("/devices", deviceRouter);

export default app;
