import fetch from "node-fetch";
import clientPromise from "../../config/mongodb";
import { ObjectId } from "mongodb";

interface DiscordUser {
  email: string;
  name: string;
  picture?: string;
  discordId: string;
}

interface User extends DiscordUser {
  _id: ObjectId;
  role: string;
  url_photo: string;
}

export async function getDiscordUser(accessToken: string): Promise<DiscordUser | null> {
  // Get basic info
  const resp = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await resp.json();
  if (!data) return null;

  // ✅ email puede no venir → fallback
  const email = data.email || `${data.id}@discord.local`;

  return {
    discordId: data.id,
    email,
    name: data.username,
    picture: data.avatar
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
      : "",
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");
  const user = await db.collection("users").findOne<User>({ email });
  return user;
}

export async function createUserDiscord(user: DiscordUser): Promise<User> {
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
  };

  const result = await db.collection("users").insertOne(newUserDocument);

  return {
    _id: result.insertedId,
    ...user,
    ...newUserDocument,
  } as User;
}
