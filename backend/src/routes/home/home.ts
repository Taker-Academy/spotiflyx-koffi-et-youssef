import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validateToken } from "../../middlewares/middlewares";
import videosRoutes from "../videos/videos";
import musicRoutes from "../music/music";
import videosAndMusicsRoutes from "./musicvideo";

const router = express.Router();

router.use(videosRoutes);
router.use(musicRoutes);
router.use(videosAndMusicsRoutes);

router.get("/home", validateToken, async (req: Request, res: Response) => {
  const user = res.locals.user;

  console.log("GET /home");

  const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Authorization", "Bearer " + token);

  return res.status(200).json({
    ok: true,
    data: {
      token,
    },
    message: "Utilisateur authentifié.",
  });
});

export default router;
