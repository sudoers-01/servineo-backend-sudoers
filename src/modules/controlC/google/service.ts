import { OAuth2Client } from "google-auth-library";
import fs from "fs";
import path from "path";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const csvPath = path.join(__dirname, "users.csv");

if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, "email,name,picture\n");
}

async function readUsers(): Promise<{ email: string; name: string; picture: string }[]> {
  const data = fs.readFileSync(csvPath, "utf8");
  const lines = data.trim().split("\n").slice(1); 
  return lines.map(line => {
    const [email, name, picture] = line.split(",");
    return { email, name, picture };
  });
}

async function saveUser(user: { email: string; name: string; picture: string }) {
  const line = `${user.email},${user.name},${user.picture}\n`;
  fs.appendFileSync(csvPath, line, "utf8");
}

export async function verifyGoogleToken(token: string) {
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

export async function checkUserExists(email: string) {
  const users = await readUsers();
  return users.some(u => u.email === email);
}

export async function createUser(user: { email: string; name: string; picture: string }) {
  await saveUser(user);
  return user;
}
