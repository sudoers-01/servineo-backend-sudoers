import { Request, Response } from 'express';

// usuario y contraseña simulados
const USUARIO_FAKE = {
  email: 'admin@example.com',
  password: '12345',
};

export const loginUsuario = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // validar campos
  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  // verificar credenciales
  if (email === USUARIO_FAKE.email && password === USUARIO_FAKE.password) {
    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      usuario: { email },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciales incorrectas',
  });
};
