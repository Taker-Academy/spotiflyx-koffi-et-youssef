import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validateToken } from "../../middlewares/middlewares";
import { UserInstance } from "../../models/models";

const router = express.Router();

router.delete(
  "/user/delete",
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
