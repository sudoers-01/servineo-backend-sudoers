import clientPromise from '../../config/mongodb';
import { ObjectId } from 'mongodb';

export async function updateUserPhoto(usuarioId: string, fotoPerfil: string): Promise<boolean> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD');
  const collection = db.collection('users');

  // Actualiza el campo `url_photo`
  const result = await collection.updateOne(
    { _id: new ObjectId(usuarioId) },
    // Escribimos ambos posibles campos por compatibilidad con datos previos
    { $set: { url_photo: fotoPerfil, url_phto: fotoPerfil } }
  );

  // result.matchedCount = 0 → no encontró el usuario
  return result.matchedCount > 0;
}
