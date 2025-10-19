import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { checkUserExists, createManualUser } from './service';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

/**
 * 🔹 Registro manual
 */
export async function manualRegister(req: Request, res: Response) {
  const { name, email, password } = req.body; // 1. Validación de campos

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Faltan datos' });

  try {
    // 2. Verificar existencia
    const exists = await checkUserExists(email);
    if (exists) return res.status(400).json({ success: false, message: 'El usuario ya existe' }); // 3. Hashear la contraseña

    const hashedPassword = await bcrypt.hash(password, 10); // 4. Crear usuario
    // newUser ahora solo contiene { name, email }

    const newUser = await createManualUser({
      name,
      email,
      password: hashedPassword,
    }); // 5. Generar JWT
    // 🛑 Nota: jwt.sign usa newUser.email y newUser.name, que es correcto.

    const token = jwt.sign({ email: newUser.email, name: newUser.name }, JWT_SECRET, {
      expiresIn: '7d',
    }); // 6. Respuesta de éxito

    return res.status(201).json({
      // Usar 201 para "Created"
      success: true,
      message: 'Usuario registrado correctamente',
      user: { name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error('🛑 ERROR FATAL en registro manual:', error); // 🛑 Aseguramos que se devuelva JSON incluso en un error 500
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar usuario.',
    });
  }
}
