import { DataTypes, Model } from "sequelize";
import { sequelize } from "../models";
import { User } from "./User";

interface MusicInstance extends Model<any, any> {
  title: string;
  id: number;
}

const Music = sequelize.define<MusicInstance>("Music", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  userId: DataTypes.UUID,
});

Music.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Music.sync({ force: false })
  .then(() => {
    console.log("Music table created.");
  })
  .catch((error) => {
    console.error("Failed to create Music table:", error);
  });

export { Music, MusicInstance };
