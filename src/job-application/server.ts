import dotenv from "dotenv";
import app from "../config/server.config.js";
import { connectDB } from "../config/db/mongoClient.js";

dotenv.config();

// Conectar a MongoDB usando la conexión del equipo
connectDB().then(() => {
  console.log('MongoDB connected successfully');
}).catch(error => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));