import { Request, Response } from 'express';
import { connectDB } from '../../config/mongoClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { googleAuth } from '../../HU3/google/controller';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Usuario no encontrado' });
    }

    const storedHash = user.passwordHash || user.password;

    if (!storedHash) {
      return res
        .status(500)
        .json({ success: false, message: 'Error interno: Hash de contraseña no encontrado.' });
    }
    
    const passwordMatch = await bcrypt.compare(password, storedHash);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Contraseña incorrecta' });
    }

    const sessionToken = jwt.sign(
      { email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: sessionToken,
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error en el servidor' });
  }
};

export const loginGoogle = async (req: Request, res: Response) => {
  return googleAuth(req, res);
};