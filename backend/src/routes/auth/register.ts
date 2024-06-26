import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserInstance } from "../../models";

const router = express.Router();

router.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      ok: false,
      error: "Mauvaise requête, paramètres manquants ou invalides.",
    });
  }

  const existingUser: UserInstance | null = await User.findOne({
    where: { email },
  });
  if (existingUser) {
    return res.status(401).json({ ok: false, error: "Mauvais identifiants." });
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);

  const user: UserInstance = User.build({
    createdAt: new Date(),
    email,
    firstName,
    lastName,
    password: hashedPassword,
  });

  try {
    await user.save();
    const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Authorization", "Bearer " + token);

    res.status(201).json({
      ok: true,
      message: "Utilisateur créé avec succès.",
      data: {
        token,
        user: {
          email,
          firstName,
          lastName,
        },
      },
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ ok: false, error: "Erreur interne du serveur." });
  }
});

export default router;
