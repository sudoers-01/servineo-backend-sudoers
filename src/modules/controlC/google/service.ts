import { OAuth2Client } from "google-auth-library";
import clientPromise from "../lib/mongodb";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

export async function verifyGoogleToken(token: string): Promise<GoogleUser | null> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) return null;

  return {
    email: payload.email,
    name: payload.name || "Sin Nombre",
    picture: payload.picture || "",
  };
}

export async function checkUserExists(email: string): Promise<boolean> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");
  const user = await db.collection("usuarios").findOne({ email });
  return !!user;
}

export async function createUser(user: GoogleUser) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  await db.collection("usuarios").insertOne({
  name: user.name,
  email: user.email,
  url_photo: user.picture || "",
  role: "requester",
  language: "es",
  createdAt: new Date(),
});
console.log("Usuario insertado en MongoDB:", user.email);


  return user;
}
