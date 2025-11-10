import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "../../../../conecionMongodb/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "servineosecretkey";

interface TokenPayload extends JwtPayload {
  id: string;
}

interface ChangePasswordData {
  currentPassword?: string; // ← Opcional para usuarios sin contraseña
  newPassword: string;
}

export const cambiarContrasenaService = async (token: string, datos: ChangePasswordData) => {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  const db = await connectDB();

  // 1. Buscar el usuario en la base de datos
  const usuario = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
  if (!usuario) throw new Error("Usuario no encontrado");

  // 2. Si el usuario NO tiene contraseña (registro con Google, etc.)
  if (!usuario.password) {
    console.log("Usuario sin contraseña - Creando contraseña inicial");
    
    // Crear contraseña inicial (sin verificar contraseña actual)
    const hashedNewPassword = await bcrypt.hash(datos.newPassword, 10);

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.id) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date(),
          lastPasswordChange: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) throw new Error("Usuario no encontrado");

    return { 
      success: true, 
      message: "Contraseña creada con éxito" 
    };
  }

  // 3. Si el usuario SÍ tiene contraseña (verificar la actual)
  if (!datos.currentPassword) {
    throw new Error("Se requiere la contraseña actual");
  }

  const isCurrentPasswordValid = await bcrypt.compare(datos.currentPassword, usuario.password);
  
  if (!isCurrentPasswordValid) {
    const err: any = new Error("La contraseña actual es incorrecta");
    err.code = "CURRENT_PASSWORD_INVALID";
    throw err;
  }

  // 4. Verificar que la nueva contraseña sea diferente
  const isSamePassword = await bcrypt.compare(datos.newPassword, usuario.password);
  if (isSamePassword) {
    throw new Error("La nueva contraseña debe ser diferente a la actual");
  }

  // 5. Actualizar la contraseña
  const hashedNewPassword = await bcrypt.hash(datos.newPassword, 10);

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(decoded.id) },
    {
      $set: {
        password: hashedNewPassword,
        updatedAt: new Date(),
        lastPasswordChange: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) throw new Error("Usuario no encontrado");

  return { 
    success: true, 
    message: "Contraseña cambiada con éxito" 
  };
};