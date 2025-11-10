import { OAuth2Client } from "google-auth-library";
import clientPromise from "../../config/mongodb";
import { ObjectId } from "mongodb";

interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

interface User extends GoogleUser {
  _id: ObjectId;
  role: string;
  url_photo: string;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export async function findUserByEmail(email: string): Promise<User | null> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");
  const user = await db.collection("users").findOne<User>({
  "authProviders.provider": "google",
  "authProviders.email": email
});
  return user;
}

export async function checkUserExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return !!user;
}

export async function createUser(user: GoogleUser): Promise<User> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const newUserDocument = {
    name: user.name,
    email: user.email, 
    url_photo: user.picture || "",
    role: "requester",
    especialidad: "",
    telefono: "",
    certificacion: "",
    language: "es",
    createdAt: new Date(),
    authProviders: [
      {
        provider: "google",
        email: user.email,
      },
    ],
  };

  const result = await db.collection("users").insertOne(newUserDocument);
  console.log("Usuario insertado en MongoDB con authProviders:", user.email);

  return {
    _id: result.insertedId,
    ...newUserDocument,
  } as User;
}
