import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserInstance } from "../../models";
import { validateToken } from "../../middlewares";

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
      { id: existingUser!.id },
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

router.put(
  "/auth/modifypassword",
  validateToken,
  async (req: Request, res: Response) => {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res.status(400).json({
        ok: false,
        error: "Mauvaise requête, paramètres manquants ou invalides.",
      });
    }
    const user: UserInstance = res.locals.user;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ ok: false, error: "Mauvais identifiants." });
    }

    let cryptNewPassword: string = await bcrypt.hash(newPassword, 10);

    try {
      await user.update({ password: cryptNewPassword });
      const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Authorization", "Bearer " + token);

      res.status(200).json({
        ok: true,
        data: {
          token,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
        message: "Mot de passe modifié avec succès.",
      });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Erreur interne du serveur." });
      console.error("Failed to update password:", error);
    }
  }
);

router.delete(
  "/auth/delete",
  validateToken,
  async (req: Request, res: Response) => {
    const user: UserInstance = res.locals.user;

    try {
      await user.destroy();
      const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Authorization", "Bearer " + token);
      res.status(200).json({
        ok: true,
        message: "Utilisateur supprimé avec succès.",
      });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Erreur interne du serveur." });
      console.error("Failed to delete user:", error);
    }
  }
);

export default router;
