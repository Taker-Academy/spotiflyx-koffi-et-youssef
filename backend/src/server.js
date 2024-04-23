const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
});

const User = sequelize.define('User', {
    createdAt: DataTypes.DATE,
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    }
});

router.post('/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ ok: false, error: 'Mauvaise requête, paramètres manquants ou invalides.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(401).json({ ok: false, error: 'Mauvais identifiants.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.build({
        createdAt: new Date(),
        email,
        firstName,
        lastName,
        password: hashedPassword,
    });

    try {
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);

        res.status(201).json({
            ok: true,
            message: 'Utilisateur créé avec succès.',
            data: {
                token,
                user: {
                    email,
                    firstName,
                    lastName,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, error: 'Mauvaise requête, paramètres manquants ou invalides.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
        firstName = existingUser.firstName;
        lastName = existingUser.lastName;
    } else {
        return res.status(401).json({ ok: false, error: 'Mauvais identifiants.', });
    }

    try {
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);

        res.status(200).json({
            ok: true,
            data: {
                token,
                user: {
                    email,
                    firstName,
                    lastName,
                },
            },
            message: 'Connexion réussie.'
        });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
