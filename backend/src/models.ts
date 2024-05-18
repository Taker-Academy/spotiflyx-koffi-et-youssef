import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

interface MusicInstance extends Model<any, any> {
  title: string;
  url: string;
}

interface VideoInstance extends Model<any, any> {
  title: string;
  url: string;
}

interface UserInstance extends Model<any, any> {
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  id: string;
  musics: MusicInstance[];
  videos: VideoInstance[];
}

const Music = sequelize.define<MusicInstance>("Music", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
});

const Video = sequelize.define<VideoInstance>("Video", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
});

const User = sequelize.define<UserInstance>("User", {
  createdAt: DataTypes.DATE,
  email: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  password: DataTypes.STRING,
  musics: DataTypes.ARRAY(DataTypes.STRING),
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

User.sync({ force: false })
  .then(() => {
    console.log("Users table created.");
  })
  .catch((error) => {
    console.error("Failed to create Users table:", error);
  });

Music.sync({ force: false })
  .then(() => {
    console.log("Music table created.");
  })
  .catch((error) => {
    console.error("Failed to create Music table:", error);
  });

Video.sync({ force: false })
  .then(() => {
    console.log("Videos table created.");
  })
  .catch((error) => {
    console.error("Failed to create Videos table:", error);
  });

export { User, UserInstance, Music, MusicInstance, Video, VideoInstance };
