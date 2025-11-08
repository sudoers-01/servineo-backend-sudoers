import { Request, Response } from "express";
import { generarToken } from "../utils/generadorToken";
import { getGitHubUser, findUserByEmail, createUser } from "./service";

export async function githubAuth(req: Request, res: Response) {
  const { code } = req.query;
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

  if (!code) return res.status(400).json({ status: "error", message: "No code provided" });

  try {
    const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });
    const tokenData = await tokenResp.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) throw new Error("No se pudo obtener access token");

    const githubUser = await getGitHubUser(accessToken);
    if (!githubUser) throw new Error("No se pudo obtener info del usuario de GitHub");

    let dbUser = await findUserByEmail(githubUser.email);
    const exists = !!dbUser;

    if (!exists) dbUser = await createUser(githubUser);

    if (!dbUser) throw new Error("No se pudo crear o encontrar usuario");

    const sessionToken = generarToken(
      dbUser._id.toHexString(),
      dbUser.name,
      dbUser.email
    );

    // Redirigir al frontend con token
    const FRONTEND_URL = process.env.FRONTEND_URL!;
    res.redirect(`${FRONTEND_URL}/auth/success?token=${sessionToken}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
}
