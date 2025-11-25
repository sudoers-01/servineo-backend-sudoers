import { OAuth2Client } from "google-auth-library";
import clientPromise from "../../config/db/mongodb";
import { ObjectId } from "mongodb";
import { IUser } from "../../models/user.model";

interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
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

export async function findUserByEmail(email: string): Promise<IUser & { _id: ObjectId } | null> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");
  const user = await db.collection<IUser>("users").findOne({
    "authProviders.provider": "google",
    "authProviders.providerId": email
  });

  if (!user) return null;

  return { ...user, _id: user._id as ObjectId };
}

export async function checkUserExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return !!user;
}

export async function createUser(googleUser: GoogleUser): Promise<IUser & { _id: ObjectId }> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const newUser: any = {
    name: googleUser.name,
    email: googleUser.email,
    url_photo: googleUser.picture || "",
    role: "requester",
    authProviders: [
      {
        provider: "google",
        providerId: googleUser.email,
        password: "",
      },
    ],
    telefono: "",
    servicios: [],
    ubicacion: {},
    ci: "",
    vehiculo: {},
    acceptTerms: false,
    metodoPago: {},
    description: "",
    workLocation: {},
  };

  const result = await db.collection<IUser>("users").insertOne(newUser);

  return { ...newUser, _id: result.insertedId };
}
