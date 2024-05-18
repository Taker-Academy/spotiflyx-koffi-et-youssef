import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validateToken } from "../../middlewares/middlewares";
import { UserInstance } from "../../models/models";
import bcrypt from "bcrypt";

const router = express.Router();

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
