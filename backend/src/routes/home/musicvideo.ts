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

router.post(
  "/addmusicandvideos",
  validateToken,
  async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });
    }

    let title = "";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      try {
        const videoId = url.split("v=")[1];
        const apiKey = process.env.YOUTUBE_API_KEY;
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
        );
        title = response.data.items[0].snippet.title;

        const video: VideoInstance = await Video.create({ url, title });
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
        const trackId = url.split("track/")[1];
        const token = process.env.SPOTIFY_TOKEN;
        const response = await axios.get(
          `https://api.spotify.com/v1/tracks/${trackId}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        title = response.data.name;

        const music: MusicInstance = await Music.create({ url, title });
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
  }
);
