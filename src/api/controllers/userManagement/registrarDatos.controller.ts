import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generarToken } from '../../../utils/generadorToken';
import { checkUserExists, createManualUser, getUserById } from '../../../services/userManagement/registrarDatos.service';
import { updateUserPhoto } from '../../../services/userManagement/fotoPerfil.service';

export async function manualRegister(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Faltan datos' });

  try {
    const exists = await checkUserExists(email);
    if (exists) return res.status(400).json({ success: false, message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await createManualUser({
      name,
      email,
      password: hashedPassword,
      picture: req.body.picture,
    });

    let finalPicture = newUser.picture;
    if (req.body.picture) {
      try {
        const updated = await updateUserPhoto(newUser._id, req.body.picture);
        if (updated) {
          const userFromDb = await getUserById(newUser._id);
          finalPicture = (userFromDb && (userFromDb.url_photo || userFromDb.url_phto || userFromDb.picture)) || finalPicture;
        } else {
          console.warn('No se pudo actualizar la foto del usuario tras el registro:', newUser._id);
        }
      } catch (err) {
        console.error('Error actualizando la foto tras registro:', err);
      }
    }

    const token = generarToken(newUser._id.toString(), newUser.name, newUser.email, finalPicture);

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: { name: newUser.name, email: newUser.email, picture: finalPicture },
      token,
    });
  } catch (error) {
    console.error('ERROR FATAL en registro manual:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar usuario.',
    });
  }
}