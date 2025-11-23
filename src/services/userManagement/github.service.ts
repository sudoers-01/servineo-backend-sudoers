import fetch from "node-fetch";
import clientPromise from "../../config/db/mongodb";
import { ObjectId } from "mongodb";
import { IUser } from "../../models/requester.model";

interface GitHubUser {
  email: string;
  name: string;
  picture?: string;
  githubId: number;
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

export async function findUserByEmail(email: string) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const user = await db.collection<IUser>("users").findOne({
    "authProviders.provider": "github",
    "authProviders.providerId": email,
  });

  if (!user) return null;
  return { ...user, _id: user._id as ObjectId };
}

export async function checkUserExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return !!user;
}

export async function createUser(githubUser: GitHubUser): Promise<IUser & { _id: ObjectId }> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const newUser: IUser = {
    name: githubUser.name,
    email: githubUser.email,
    url_photo: githubUser.picture || "",
    role: "requester",

    authProviders: [
      {
        provider: "github",
        providerId: githubUser.email,
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
    experience: {},
    workLocation: {},
  };

  const result = await db.collection<IUser>("users").insertOne(newUser);

  return { ...newUser, _id: result.insertedId };
}