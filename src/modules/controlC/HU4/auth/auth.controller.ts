import { Request, Response } from 'express';
import { connectDB } from '../../config/mongoClient';
import bcrypt from 'bcryptjs';
import { generarToken } from '../../utils/generadorToken';
import { googleAuth } from '../../HU3/google/controller';
import { ObjectId } from 'mongodb';

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos (email o contraseña)',
    });
  }

  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      'authProviders.provider': 'email',
      'authProviders.email': email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado o sin método de correo vinculado',
      });
    }

    const emailProvider = user.authProviders.find(
      (p: any) => p.provider === 'email' && p.email === email
    );

    if (!emailProvider || !emailProvider.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'El método de correo no tiene contraseña registrada',
      });
    }

    const passwordMatch = await bcrypt.compare(password, emailProvider.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta',
      });
    }

    const userPicture = user.url_photo || null;

    const sessionToken = generarToken(
      user._id.toString(),
      user.name || 'Usuario',
      email,
      userPicture
    );

    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: sessionToken,
      user: {
        id: user._id.toString(),
        name: user.name || 'Usuario',
        email,
        picture: userPicture,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión con correo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const loginGoogle = async (req: Request, res: Response) => {
  return googleAuth(req, res);
};
