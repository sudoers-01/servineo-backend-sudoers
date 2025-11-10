import { Router } from "express";
import { discordAuth } from "./controller";

const router = Router();

router.get("/discord", (req, res) => {
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
 const redirect_uri = `${process.env.BASE_URL}/auth/discord/callback`;
  const scope = "identify email";

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  res.redirect(discordAuthUrl);
});

router.get("/discord/callback", discordAuth);
console.log("¿Qué es discordAuth?", typeof discordAuth);


export default router;
