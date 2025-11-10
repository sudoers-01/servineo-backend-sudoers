import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "../../../../conecionMongodb/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "servineosecretkey";
const MAX_INTENTOS = 3;
const TIEMPO_BLOQUEO = 1 * 60 * 1000; // 1 minuto para pruebas (puedes cambiarlo a 15 * 60 * 1000)

interface TokenPayload extends JwtPayload {
  id: string;
}

interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}

//FUNCIÓN para verificar bloqueo
const verificarBloqueo = async (db: any, userId: string) => {
  const usuario = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { passwordAttempts: 1, password: 1, name: 1, email: 1 } }
  );

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const ahora = new Date();
  const attempts = usuario.passwordAttempts || { count: 0, lastAttempt: null, blockedUntil: null };

  // Verificar si está bloqueado
  if (attempts.blockedUntil && new Date(attempts.blockedUntil) > ahora) {
    const minutosRestantes = Math.ceil((new Date(attempts.blockedUntil).getTime() - ahora.getTime()) / 60000);
    
    return {
      blocked: true,
      error: `Cuenta bloqueada por seguridad. Sesión cerrada automáticamente. Podrás intentar de nuevo en ${minutosRestantes} minutos.`,
      forceLogout: true,
      usuario
    };
  }
  // SOLO resetear si había un bloqueo que ya expiró
  else if (attempts.blockedUntil && new Date(attempts.blockedUntil) <= ahora) {
    console.log(" Bloqueo expirado - Reseteando contador");
    
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { passwordAttempts: "" } }
    );
    
    // Recargar usuario sin intentos
    const usuarioLimpio = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { passwordAttempts: 1, password: 1, name: 1, email: 1 } }
    );
    
    return { blocked: false, usuario: usuarioLimpio, attempts: { count: 0 } };
  }

  // Si solo tiene intentos pero no está bloqueado, NO resetear
  return { blocked: false, usuario, attempts };
};

// FUNCIÓN para manejar intento fallido
const manejarIntentoFallido = async (db: any, userId: string, usuario: any) => {
  const ahora = new Date();
  
  // OBTENER ESTADO ACTUAL de la BD (por si se reseteo)
  const usuarioActual = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { passwordAttempts: 1 } }
  );
  
  let attempts = usuarioActual?.passwordAttempts || { count: 0, lastAttempt: null, blockedUntil: null };

  attempts.count += 1;
  attempts.lastAttempt = ahora;

  // Si alcanzó el máximo, bloquear
  if (attempts.count >= MAX_INTENTOS) {
    attempts.blockedUntil = new Date(ahora.getTime() + TIEMPO_BLOQUEO);
    
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { passwordAttempts: attempts } }
    );

    return {
      blocked: true,
      error: `Demasiados intentos fallidos (${MAX_INTENTOS}). Sesión cerrada por seguridad. Podrás intentar de nuevo en ${Math.ceil(TIEMPO_BLOQUEO / 60000)} minutos.`,
      forceLogout: true
    };
  }

  // Actualizar contador
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { passwordAttempts: attempts } }
  );

  return {
    blocked: false,
    error: `La contraseña actual es incorrecta. Intentos restantes: ${MAX_INTENTOS - attempts.count}`,
    forceLogout: false
  };
};

// 🔧 TU FUNCIÓN PRINCIPAL MODIFICADA
export const cambiarContrasenaService = async (token: string, datos: ChangePasswordData) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const db = await connectDB();

    // 🔒 VERIFICAR BLOQUEO PRIMERO
    const bloqueoResult = await verificarBloqueo(db, decoded.id);
    
    if (bloqueoResult.blocked) {
      return {
        success: false,
        message: bloqueoResult.error,
        forceLogout: bloqueoResult.forceLogout
      };
    }

    const { usuario } = bloqueoResult;

    // 2. Si el usuario NO tiene contraseña (registro con Google, etc.)
    if (!usuario.password) {
      console.log("Usuario sin contraseña - Creando contraseña inicial");
      
      const hashedNewPassword = await bcrypt.hash(datos.newPassword, 10);

      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(decoded.id) },
        {
          $set: {
            password: hashedNewPassword,
            updatedAt: new Date(),
            lastPasswordChange: new Date(),
          },
          $unset: { passwordAttempts: "" } // Limpiar intentos
        }
      );

      if (result.matchedCount === 0) throw new Error("Usuario no encontrado");

      return { 
        success: true, 
        message: "Contraseña creada con éxito",
        forceLogout: false
      };
    }

    // 3. Si el usuario SÍ tiene contraseña (verificar la actual)
    if (!datos.currentPassword) {
      throw new Error("Se requiere la contraseña actual");
    }

    const isCurrentPasswordValid = await bcrypt.compare(datos.currentPassword, usuario.password);
    
    // MANEJAR CONTRASEÑA INCORRECTA CON BLOQUEO
    if (!isCurrentPasswordValid) {
  const failResult = await manejarIntentoFallido(db, decoded.id, usuario);
  
  // Si es bloqueo total, retornar inmediatamente
      if (failResult.forceLogout) {
        return {
          success: false,
          message: failResult.error,
          forceLogout: failResult.forceLogout
          };
      }
  
  // Si no es bloqueo, lanzar error con código específico
        const err: any = new Error(failResult.error);
        err.code = "CURRENT_PASSWORD_INVALID";
        throw err;
    }

    // 4. Verificar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(datos.newPassword, usuario.password);
    if (isSamePassword) {
      throw new Error("La nueva contraseña debe ser diferente a la actual");
    }

    // 5. ÉXITO - Actualizar la contraseña y limpiar intentos
    const hashedNewPassword = await bcrypt.hash(datos.newPassword, 10);

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.id) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date(),
          lastPasswordChange: new Date(),
        },
        $unset: { passwordAttempts: "" } // Limpiar intentos fallidos
      }
    );

    if (result.matchedCount === 0) throw new Error("Usuario no encontrado");

    return { 
      success: true, 
      message: "Contraseña cambiada con éxito",
      forceLogout: false
    };

  } catch (error: any) {
    //console.error("Error en cambiarContrasenaService:", error);
    throw error;
  }
};