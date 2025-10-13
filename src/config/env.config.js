//archivos para exportar de variables de entorno de .env
import dotenv from 'dotenv';

dotenv.config();


export const SERVER_PORT = process.env.SERVER_PORT || 3001;

//aqui ponemos lo que queremos exportar
//export const SERVER_PORT = process.env.SERVER_PORT || 4000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Debug: verificar que las variables se cargan
console.log('🔍 Environment variables loaded:');
console.log('PORT:', SERVER_PORT);
console.log('MONGODB_URI:', MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('   NODE_ENV:', NODE_ENV);
console.log('STRIPE_SECRET_KEY:', STRIPE_SECRET_KEY ? '✅ Loaded' : '❌ Missing');
console.log('STRIPE_WEBHOOK_SECRET:', STRIPE_WEBHOOK_SECRET ? '✅ Loaded' : '❌ Missing');
