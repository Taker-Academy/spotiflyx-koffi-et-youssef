import express, { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User, UserInstance } from "../models";

dotenv.config();

export const validateToken = async (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ ok: false, message: "Mauvais token JWT." });
  }
  const token: string = req.headers.authorization.split(" ")[1];
  let decoded: any;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Mauvais token JWT." });
  }

  let id: number = decoded.id;
  const user: UserInstance | null = await User.findOne({ where: { id } });

  if (!user) {
    return res
      .status(404)
      .json({ ok: false, message: "Utilisateur non trouvé." });
  }

  res.locals.user = user;
  next();
};
