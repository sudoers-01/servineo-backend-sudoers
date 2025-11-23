import * as admin from 'firebase-admin';

// Ruta al JSON que descargaste de Firebase Console
const serviceAccount = require('../../serviceAccountKey.json'); // o firebase-service-account.json

// Inicializa UNA sola vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'conexia-400921.appspot.com',
  });
}

export const db = admin.firestore();
export const storage = admin.storage();
export const bucket = storage.bucket();

// Configuraciones recomendadas
db.settings({
  ignoreUndefinedProperties: true,
});