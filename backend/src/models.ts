import { DataTypes, Model, Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

interface UserInstance extends Model<any, any> {
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  id: string;
}

interface MusicInstance extends Model<any, any> {
  title: string;
  id: number;
}

interface VideoInstance extends Model<any, any> {
  title: string;
  id: number;
}

const User = sequelize.define<UserInstance>("User", {
  createdAt: DataTypes.DATE,
  email: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  password: DataTypes.STRING,
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

const Music = sequelize.define<MusicInstance>("Music", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  userId: DataTypes.UUID,
});

const Video = sequelize.define<VideoInstance>("Video", {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  userId: DataTypes.UUID,
});

Music.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Music, {
  foreignKey: 'userId',
  as: 'musics',
});

User.hasMany(Video, {
  foreignKey: 'userId',
  as: 'videos',
});

Video.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export {
  User,
  UserInstance,
  Music,
  MusicInstance,
  Video,
  VideoInstance,
};