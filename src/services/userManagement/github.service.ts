import fetch from "node-fetch";
import clientPromise from "../../config/db/mongodb";
import { ObjectId } from "mongodb";

interface GitHubUser {
  email: string;
  name: string;
  picture?: string;
  githubId: number;
}

interface User extends GitHubUser {
  authProviders: any;
  _id: ObjectId;
  role: string;
  url_photo: string;
}

export async function getGitHubUser(accessToken: string): Promise<GitHubUser | null> {
  const userResp = await fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${accessToken}` },
  });
  const userData = await userResp.json();

  const emailResp = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `token ${accessToken}` },
  });
  const emails = await emailResp.json();
  const primaryEmail = emails.find((e: any) => e.primary)?.email;

  if (!primaryEmail) return null;

  return {
    githubId: userData.id,
    email: primaryEmail,
    name: userData.name || userData.login,
    picture: userData.avatar_url,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");
  const user = await db.collection("users").findOne<User>({ email });
  return user;
}

export async function createUser(user: GitHubUser): Promise<User> {
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
    authProviders: [{ provider: "github", email: user.email, githubId: user.githubId }],
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUserDocument);
  console.log("Usuario insertado en MongoDB:", user.email);

  return {
    _id: result.insertedId,
    ...user,
    ...newUserDocument,
  } as unknown as User;
}