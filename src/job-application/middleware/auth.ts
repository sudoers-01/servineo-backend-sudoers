import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  // Puedes agregar otras propiedades del token aquí
}

interface AuthRequest extends Request {
  user?: DecodedToken;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Obtener token del header "Authorization"
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ msg: 'No hay token o formato inválido' });
      return;
    }

    // Extraer el token real
    const token = authHeader.split(' ')[1];

    // Verificar y decodificar
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    // Añadir el usuario al request
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Error en authMiddleware:', (error as Error).message);
    res.status(401).json({ msg: 'Token no válido o expirado' });
  }
};

export default authMiddleware;