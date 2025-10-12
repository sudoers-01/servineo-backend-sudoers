import fs from "fs";
import path from "path";

const csvPath = path.join(__dirname, "ubicaciones.csv");

export const guardarUbicacion = async (lat: number, lng: number) => {
  const timestamp = new Date().toISOString();
  const fila = `${timestamp},${lat},${lng}\n`;

  try {
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, "timestamp,lat,lng\n", "utf8");
    }

    fs.appendFileSync(csvPath, fila, "utf8");
  } catch (error) {
    console.error("Error guardando en CSV:", error);
    throw error;
  }
};