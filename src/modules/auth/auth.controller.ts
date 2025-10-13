// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { connectDB } from '../../config/db/mongoClient';
import bcrypt from 'bcryptjs';

// ✅ Login con base de datos real
export const loginUsuario = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    // Buscar usuario por email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Login correcto
    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      usuario: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};
