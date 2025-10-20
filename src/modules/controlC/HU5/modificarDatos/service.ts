import jwt, { JwtPayload } from "jsonwebtoken";
import { connectDB } from "../../config/mongoClient";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

interface TokenPayload extends JwtPayload {
  id: string;
}

interface UpdateRequesterData {
  phone: string;
  direction: string;
  coordinates: [number, number];
}

export const obtenerDatosUsuarioService = async (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  const db = await connectDB();

  const usuario = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
  if (!usuario) throw new Error("Usuario no encontrado");

  delete usuario.password;

  return {
    requesterId: usuario._id,
    phone: usuario.phone || "",
    direction: usuario.direction || "",
    coordinates: usuario.coordinates || [0, 0],
  };
};

export const actualizarDatosUsuarioService = async (token: string, nuevosDatos: UpdateRequesterData) => {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  const db = await connectDB();

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(decoded.id) }, 
    {
      $set: {
        phone: nuevosDatos.phone,
        direction: nuevosDatos.direction,
        coordinates: nuevosDatos.coordinates,
      },
    }
  );

  if (result.matchedCount === 0) throw new Error("Usuario no encontrado");

  return { success: true, message: "Perfil actualizado con éxito." };
};
