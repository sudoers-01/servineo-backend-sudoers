import { Request, Response } from "express";
import { generarToken } from "../utils/generadorToken";
import { getGitHubUser, findUserByEmail, createUser } from "./service";

export async function githubAuth(req: Request, res: Response) {
  const { code } = req.query;
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

  console.log("🔹 GitHub OAuth callback iniciado");
  console.log("Query recibida:", req.query);

  if (!code) {
    console.warn("No se proporcionó 'code' en la query");
    return res.status(400).send("No code provided");
  }

  try {
    console.log("1️Intercambiando code por access token...");

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("code", String(code));

    const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: params,
    });

    const tokenData = await tokenResp.json();
    console.log("Respuesta tokenData:", tokenData);

    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error("No se pudo obtener access token");

    console.log("Access token obtenido:", accessToken);

    console.log("2️Obteniendo info del usuario de GitHub...");
    const githubUser = await getGitHubUser(accessToken);
    console.log("GitHub user obtenido:", githubUser);
    if (!githubUser) throw new Error("No se pudo obtener info del usuario de GitHub");

    console.log("3️Buscando usuario en MongoDB...");
    let dbUser = await findUserByEmail(githubUser.email);
    let isFirstTime = false;

    if (!dbUser) {
     
      console.log("Usuario no encontrado, creando nuevo usuario...");
      dbUser = await createUser(githubUser);
      isFirstTime = true;
      console.log("Usuario creado:", dbUser);
    } else {
     
      const hasGithub = dbUser.authProviders?.some((p: any) => p.provider === "github");
      if (!hasGithub) {
        isFirstTime = true; 
        console.log("Usuario existente sin GitHub vinculado → primera vez vinculando");
      } else {
        console.log("Usuario ya tiene GitHub vinculado → no es primera vez");
      }
    }

    if (!dbUser) throw new Error("No se pudo crear o encontrar usuario");

    console.log("4️Generando JWT...");
    const sessionToken = generarToken(dbUser._id.toHexString(), dbUser.name, dbUser.email);
    console.log("JWT generado:", sessionToken);

    console.log("5️Enviando HTML al popup para comunicar éxito...");
    res.send(`
      <script>
        console.log("PostMessage enviado al frontend");
        window.opener.postMessage({
          type: 'GITHUB_AUTH_SUCCESS',
          token: '${sessionToken}',
          isFirstTime: ${isFirstTime},
          client: ${JSON.stringify(dbUser)}
        }, 'http://localhost:3000');
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("Error en GitHub OAuth:", err);

    res.send(`
      <script>
        console.log("PostMessage enviado al frontend con error");
        window.opener.postMessage({
          type: 'GITHUB_AUTH_ERROR',
          message: 'Error al autenticar con GitHub',
          details: '${err instanceof Error ? err.message : err}'
        }, 'http://localhost:3000');
        window.close();
      </script>
    `);
  }
}
