import { DataTypes, Model } from "sequelize";
import { sequelize } from "./models";
import { User } from "./User";

interface VideoInstance extends Model<any, any> {
  title: string;
  id: number;
}

const Video = sequelize.define<VideoInstance>("Video", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  userId: DataTypes.UUID,
});

Video.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Video.sync({ force: false })
  .then(() => {
    console.log("Videos table created.");
  })
  .catch((error) => {
    console.error("Failed to create Videos table:", error);
  });

export { Video, VideoInstance };
