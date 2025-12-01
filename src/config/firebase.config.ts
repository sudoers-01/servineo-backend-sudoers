import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
  const serviceAccountExists = fs.existsSync(serviceAccountPath);

  if (serviceAccountExists) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'conexia-400921.appspot.com',
      });
    } catch (error) {
      console.warn('Error cargando firebase-service-account.json → usando firebaseConfig del .env');
      initializeWithEnv();
    }
  } else {
    console.log('firebase-service-account.json no encontrado → usando firebaseConfig del .env');
    initializeWithEnv();
  }
}

function initializeWithEnv() {
  const firebaseConfig: any = {};

  if (process.env.FIREBASE_PROJECT_ID) {
    firebaseConfig.projectId = process.env.FIREBASE_PROJECT_ID;
  }

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'conexia-400921.appspot.com',
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      ...firebaseConfig,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'conexia-400921.appspot.com',
    });
  }
}

// Exportamos siempre lo mismo
export const db = admin.firestore();
export const storage = admin.storage();
export const bucket = storage.bucket();

// Configuración global recomendada para Firestore (mejor rendimiento)
db.settings({
  timestampsInSnapshots: true, // deprecated pero por si acaso
  ignoreUndefinedProperties: true,
});
