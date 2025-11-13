import { Request, Response } from "express";
import { generarToken } from "../../utils/generadorToken";
import { getDiscordUser, findUserByEmail, createUserDiscord } from "./service";

export async function discordAuth(req: Request, res: Response) {
  const { code } = req.query;

  if (!code) return res.status(400).json({ status: "error", message: "No code provided" });

  try {
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
    const NODE_ENV = process.env.NODE_ENV || "development";
    const FRONTEND_URL = process.env.FRONTEND_URL!;

    const redirect_uri =
      NODE_ENV === "production"
        ? "https://backdos.vercel.app/auth/discord/callback"
        : "http://localhost:8000/auth/discord/callback";

    const tokenResp = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code.toString(),
        grant_type: "authorization_code",
        redirect_uri,
      }),
    });

    const tokenData = await tokenResp.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error("No se pudo obtener access token");

    const discordUser = await getDiscordUser(accessToken);
    if (!discordUser) throw new Error("No se pudo obtener info del usuario");

    let dbUser = await findUserByEmail(discordUser.email);
    let isFirstTime = false;
    if (!dbUser) {
      dbUser = await createUserDiscord(discordUser);
      isFirstTime = true;
    }

    const sessionToken = generarToken(
      dbUser._id.toHexString(),
      dbUser.name,
      dbUser.email,
      dbUser.url_photo
    );

    res.send(`
      <script>
        window.opener.postMessage({
          type: 'DISCORD_AUTH_SUCCESS',
          token: '${sessionToken}',
          isFirstTime: ${isFirstTime}
        }, '${FRONTEND_URL}');
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("Error en Discord OAuth:", err);
    res.send(`
      <script>
        window.opener.postMessage({
          type: 'DISCORD_AUTH_ERROR',
          message: 'Error al autenticar con Discord'
        }, '${process.env.FRONTEND_URL}');
        window.close();
      </script>
    `);
  }
}
