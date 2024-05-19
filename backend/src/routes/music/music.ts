import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {
  Music,
  MusicInstance,
} from "../../models";
import axios from "axios";
import { validateToken } from "../../middlewares/middlewares";

const router = express.Router();
dotenv.config();

router.delete(
  "/home/music/:id",
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    try {
      const music: MusicInstance | null = await Music.findByPk(id);

      if (!music) {
        return res.status(404).json({
          ok: false,
          message: "Music not found.",
        });
      }

      await music.destroy();
      return res.status(200).json({
        ok: true,
        message: "Music deleted successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while deleting the music.",
      });
    }
  }
);

router.get(
  "/home/musics",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const musics: MusicInstance[] = await Music.findAll();
      return res.status(200).json({
        ok: true,
        data: musics,
        message: "Musics retrieved successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while retrieving the musics.",
      });
    }
  }
);

router.get(
  "/home/musics/:id",
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    try {
      const music: MusicInstance | null = await Music.findByPk(id);

      if (!music) {
        return res.status(404).json({
          ok: false,
          message: "Music not found.",
        });
      }

      return res.status(200).json({
        ok: true,
        data: music,
        message: "Music retrieved successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while retrieving the music.",
      });
    }
  }
);

export default router;
