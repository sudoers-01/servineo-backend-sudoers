// back/servineo-backend/src/captchaPagos/recaptchaV2.middleware.ts

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// 🟢 Definir la interfaz de la respuesta de reCAPTCHA
interface RecaptchaResponse {
    success: boolean;
    challenge_ts?: string; // timestamp of the challenge load
    hostname?: string;      // hostname of the site where the challenge was solved
    'error-codes'?: string[]; // Error codes, if verification fails
}

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export const verifyRecaptchaV2 = async (req: Request, res: Response, next: NextFunction) => {
    const recaptchaToken = req.body['g-recaptcha-response']; 

    if (!recaptchaToken) {
        return res.status(400).json({ message: 'Error de seguridad: Falta el token CAPTCHA. Por favor, marca la casilla "No soy un robot".' });
    }
    
    if (!RECAPTCHA_SECRET_KEY) {
        console.error('CRÍTICO: RECAPTCHA_SECRET_KEY no está configurada.');
        return res.status(500).json({ message: 'Error de configuración del servidor.' });
    }

    try {
        const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
        
        const response = await axios.post<RecaptchaResponse>( // 🟢 Tipificación de la respuesta
            `${verificationURL}`, 
            `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        
        // 🟢 Ahora 'data' está correctamente tipificado y los errores desaparecen
        const data = response.data;
        
        if (!data.success) {
            console.warn('Bloqueando solicitud: Verificación CAPTCHA fallida.', data['error-codes']);
            return res.status(403).json({ 
                message: 'Verificación CAPTCHA fallida. Inténtalo de nuevo.',
                errorCodes: data['error-codes']
            });
        }
        
        next();

    } catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
        res.status(500).json({ message: 'Error en la verificación de seguridad externa.' });
    }
};