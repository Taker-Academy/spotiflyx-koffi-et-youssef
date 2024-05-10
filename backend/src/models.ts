import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
});

interface UserInstance extends Model<any, any> {
    createdAt: Date;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    id: string;
}

const User = sequelize.define<UserInstance>('User', {
    createdAt: DataTypes.DATE,
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

User.sync({ force: false })
    .then(() => {
        console.log('Users table created.');
    })
    .catch(error => {
        console.error('Failed to create Users table:', error);
    });

export { User , UserInstance };