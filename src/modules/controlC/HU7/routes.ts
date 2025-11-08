import { Router } from "express";
import { githubAuth } from "./controller";

const router = Router();

router.get("/github/callback", githubAuth);

router.get("/github", (req, res) => {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const redirect_uri = `${process.env.BASE_URL}/auth/github/callback`;
  const scope = "user:email";

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}`;
  res.redirect(githubAuthUrl);
});

export default router;
