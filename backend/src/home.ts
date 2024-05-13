import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserInstance } from './models';

const router = express.Router();

router.get('/home', async (req: Request, res: Response) => {
    console.log('GET /home');
    if (!req.headers.authorization) {
        return res.status(401).json({ ok: false, message: 'Mauvais token JWT.' });
    }
    const token: string = req.headers.authorization.split(' ')[1];
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
        return res.status(401).json({ ok: false, message: 'Mauvais token JWT.' });
    }

    let id: number = decoded.id;
    const user: UserInstance | null = await User.findOne({ where: { id } });

    if (user){
        const senttoken: string = jwt.sign({ id: user!.id }, process.env.JWT_SECRET!, {
            expiresIn: '24h',
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + senttoken);

        return res.status(200).json({
            ok: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } else
        return res.status(401).json({ ok: false, message: 'Mauvais token JWT.' });
});

export default router;