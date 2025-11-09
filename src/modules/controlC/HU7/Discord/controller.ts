import { Request, Response } from "express";
import { generarToken } from "../../utils/generadorToken";
import { getDiscordUser, findUserByEmail, createUserDiscord } from "./service";

export async function discordAuth(req: Request, res: Response) {
  const { code } = req.query;

  if (!code) return res.status(400).json({ status: "error", message: "No code provided" });

  try {
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
    const REDIRECT_URI = `${process.env.BASE_URL}/auth/discord/callback`;

    // ✅ 1) Obtener accessToken desde Discord
    const tokenResp = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code.toString(),
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResp.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) throw new Error("No se pudo obtener access token de Discord");

    // ✅ 2) Obtener usuario
    const discordUser = await getDiscordUser(accessToken);
    if (!discordUser) throw new Error("No se pudo obtener info del usuario de Discord");

    // ✅ 3) Buscar o crear
    let dbUser = await findUserByEmail(discordUser.email);
    const exists = !!dbUser;

    if (!exists) {
      dbUser = await createUserDiscord(discordUser);
    }
    if (!dbUser) throw new Error("No se pudo crear o encontrar usuario");

    // ✅ 4) Token
    const sessionToken = generarToken(
      dbUser._id.toHexString(),
      dbUser.name,
      dbUser.email,
      dbUser.url_photo
    );

    // ✅ 5) Redirigir a frontend
    const FRONTEND_URL = process.env.FRONTEND_URL!;
    res.redirect(`${FRONTEND_URL}/auth/successDiscord?token=${sessionToken}&firstTime=${!exists}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
}
