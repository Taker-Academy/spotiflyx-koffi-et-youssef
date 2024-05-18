// models.ts
import { Sequelize } from "sequelize";
import { User, UserInstance } from "./User";
import { Music, MusicInstance } from "./Music";
import { Video, VideoInstance } from "./Video";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

export {
  sequelize,
  User,
  UserInstance,
  Music,
  MusicInstance,
  Video,
  VideoInstance,
};
