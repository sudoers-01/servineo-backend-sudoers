import clientPromise from "../../config/db/mongodb";
import { ObjectId } from "mongodb";

interface ManualUser {
  email: string;
  name: string;
  picture?: string;
  password: string;
}

interface InsertedUser {
  email: string;
  name: string;
}


export async function checkUserExists(email: string): Promise<boolean> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const user = await db.collection("users").findOne({
    "authProviders.provider": "email",
    "authProviders.providerId": email,
  });

  return !!user;
}

export async function createManualUser(
  user: ManualUser
): Promise<InsertedUser & { _id: string; picture?: string }> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const newUser = {
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
        provider: "email",
        providerId: user.email,
        password: user.password, 
        linkedAt: new Date(),
      },
    ],

    servicios: [],
    ubicacion: {},
    ci: "",
    vehiculo: {},
    acceptTerms: false,
    metodoPago: {},
    experience: {},
    workLocation: {},
  };

  const result = await db.collection("users").insertOne(newUser);

  console.log("Usuario manual creado:", user.email);

  return {
    _id: result.insertedId.toHexString(),
    name: user.name,
    email: user.email,
    picture: user.picture || "",
  };
}

export async function getUserById(usuarioId: string): Promise<any | null> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("ServineoBD");

  const user = await db
    .collection("usuarios")
    .findOne({ _id: new ObjectId(usuarioId) });

  return user;
}
