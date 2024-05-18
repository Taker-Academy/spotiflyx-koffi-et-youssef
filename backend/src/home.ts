import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validateToken } from "./middlewares";

const router = express.Router();

router.get("/", validateToken, async (req: Request, res: Response) => {
  const user = res.locals.user;

  const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Authorization", "Bearer " + token);

  return res.status(200).json({
    ok: true,
    message: "Utilisateur authentifié.",
  });
});

export default router;
