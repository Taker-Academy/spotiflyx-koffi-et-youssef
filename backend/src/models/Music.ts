import { DataTypes, Model } from "sequelize";
import { sequelize } from "./models";

interface MusicInstance extends Model<any, any> {
  title: string;
  url: string;
}

const Music = sequelize.define<MusicInstance>("Music", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
});

Music.sync({ force: false })
  .then(() => {
    console.log("Music table created.");
  })
  .catch((error) => {
    console.error("Failed to create Music table:", error);
  });

export { Music, MusicInstance };
