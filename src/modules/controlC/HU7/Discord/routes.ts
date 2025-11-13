import { Router } from "express";
import { discordAuth } from "./controller";

const router = Router();

router.get("/discord/callback", discordAuth);

router.get("/discord", (req, res) => {
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
  const NODE_ENV = process.env.NODE_ENV || "development";

  const redirect_uri =
    NODE_ENV === "production"
      ? "https://backdos.vercel.app/auth/discord/callback"
      : "http://localhost:8000/auth/discord/callback";

  const scope = "identify email";
  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  res.redirect(discordUrl);
});

export default router;

