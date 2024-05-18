import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {
  Video,
  VideoInstance,
  Music,
  MusicInstance,
} from "../../models/models";
import axios from "axios";
import { validateToken } from "../../middlewares/middlewares";

const router = express.Router();
dotenv.config();

async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const encodedCredentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    null,
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "client_credentials",
      },
    }
  );

  return response.data.access_token;
}

router.post("/home/add", validateToken, async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .json({ ok: false, message: "Missing required fields." });
  }

  let title = "";
  let id = "";

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    try {
      id = url.split("v=")[1];
      const apiKey = process.env.YOUTUBE_API_KEY;
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=snippet`
      );
      title = response.data.items[0].snippet.title;

      const video: VideoInstance = await Video.create({ id, title });
      return res.status(200).json({
        ok: true,
        data: video,
        message: "Video added successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while adding the video.",
      });
    }
  } else if (url.includes("spotify.com")) {
    try {
      id = url.split("track/")[1];
      const token = await getSpotifyToken();
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      title = response.data.name;

      const music: MusicInstance = await Music.create({ id, title });
      return res.status(200).json({
        ok: true,
        data: music,
        message: "Music added successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An error occurred while adding the music.",
      });
    }
  } else {
    return res.status(400).json({
      ok: false,
      message: "Invalid URL. Only YouTube and Spotify links are accepted.",
    });
  }
});

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

router.get(
  "/home/latest",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const musics: MusicInstance[] = await Music.findAll({
        order: [["createdAt", "DESC"]],
        limit: 3,
      });

      const videos: VideoInstance[] = await Video.findAll({
        order: [["createdAt", "DESC"]],
        limit: 3,
      });

      return res.status(200).json({
        ok: true,
        data: { musics, videos },
        message: "Latest musics and videos retrieved successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message:
          "An error occurred while retrieving the latest musics and videos.",
      });
    }
  }
);
