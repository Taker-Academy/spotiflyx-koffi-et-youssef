import { DataTypes, Model } from "sequelize";
import { sequelize } from "./models";

interface VideoInstance extends Model<any, any> {
  title: string;
  url: string;
}

const Video = sequelize.define<VideoInstance>("Video", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
});

Video.sync({ force: false })
  .then(() => {
    console.log("Videos table created.");
  })
  .catch((error) => {
    console.error("Failed to create Videos table:", error);
  });

export { Video, VideoInstance };
