import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {
  Video,
  VideoInstance
} from "../../models";
import { validateToken } from "../../middlewares/middlewares";

const router = express.Router();
dotenv.config();

router.get(
  "/home/videos",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const videos: VideoInstance[] = await Video.findAll();
      return res.status(200).json({
        ok: true,
        data: videos,
        message: "Videos retrieved successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while retrieving the videos.",
      });
    }
  }
);

router.get(
  "/home/videos/:id",
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    try {
      const video: VideoInstance | null = await Video.findByPk(id);

      if (!video) {
        return res.status(404).json({
          ok: false,
          message: "Video not found.",
        });
      }

      return res.status(200).json({
        ok: true,
        data: video,
        message: "Video retrieved successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while retrieving the video.",
      });
    }
  }
);

router.delete(
  "/home/videos/:id",
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    try {
      const video: VideoInstance | null = await Video.findByPk(id);

      if (!video) {
        return res.status(404).json({
          ok: false,
          message: "Video not found.",
        });
      }

      await video.destroy();
      return res.status(200).json({
        ok: true,
        message: "Video deleted successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while deleting the video.",
      });
    }
  }
);

export default router;
