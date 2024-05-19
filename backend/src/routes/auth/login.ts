import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserInstance } from "../../models";

const router = express.Router();

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      error: "Mauvaise requête, paramètres manquants ou invalides.",
    });
  }

  const existingUser: UserInstance | null = await User.findOne({
    where: { email },
  });
  if (
    !(existingUser && (await bcrypt.compare(password, existingUser.password)))
  ) {
    return res.status(401).json({ ok: false, error: "Mauvais identifiants." });
  }

  try {
    const token: string = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "24h",
      }
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Authorization", "Bearer " + token);

    res.status(200).json({
      ok: true,
      data: {
        token,
        user: {
          email,
          firstName: existingUser!.firstName,
          lastName: existingUser!.lastName,
        },
      },
      message: "Connexion réussie.",
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Erreur interne du serveur." });
  }
});

export default router;
