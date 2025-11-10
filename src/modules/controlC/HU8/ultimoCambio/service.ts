import { connectDB } from "../../../../conecionMongodb/mongodb";
import { ObjectId } from "mongodb";

export const consultarUltimoCambioService = async (userId: string) => {
  try {
    const db = await connectDB();
    
    // Buscar el usuario específico por su ID
    const usuario = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { 
        projection: { 
          lastPasswordChange: 1,
          password: 1,
          name: 1,
          email: 1,
          createdAt: 1
        } 
      }
    );

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
  
    // Formatear la fecha específica de este usuario
    let fechaFormateada = 'Nunca establecida';
    
    if (usuario.lastPasswordChange) {
      const fecha = new Date(usuario.lastPasswordChange);
      fechaFormateada = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (usuario.password) {
      fechaFormateada = 'Establecida en el registro';
    } else {
      fechaFormateada = 'Sin contraseña (login social)';
    }

    return {
      success: true,
      userId: usuario._id,
      userName: usuario.name,
      userEmail: usuario.email,
      hasPassword: !!usuario.password,
      lastPasswordChange: usuario.lastPasswordChange,
      fechaFormateada: fechaFormateada
    };

  } catch (error: any) {
    console.error("Error en consultarUltimoCambioService:", error);
    throw error;
  }
};