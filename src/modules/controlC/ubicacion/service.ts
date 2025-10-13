import clientPromise from "../lib/mongodb";

export const guardarUbicacionUsuario = async (email: string, lat: number, lng: number) => {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  await db.collection("usuarios").updateOne(
    { email },
    { $set: { ubicacion: { lat, lng }, updatedAt: new Date() } }
  );

  console.log(`Ubicación guardada para ${email}: [${lat}, ${lng}]`);
};
