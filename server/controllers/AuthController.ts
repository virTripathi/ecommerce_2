import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, JwtToken } from '../database/Models';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

class AuthController {
    async signup(req: Request, res: Response) {
        const { name, email, mobile_number, address, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ 
            name, 
            email, 
            mobile_number, 
            address, 
            password: hashedPassword 
        });

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    }

    async login(req: Request, res: Response) {
        console.log('login');
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        const expiresAt = new Date(Date.now() + 3600 * 1000);
        await JwtToken.create({ user_id: user.id, token, expires_at: expiresAt });

        return res.json({ token, user });
    }

    async logout(req: Request, res: Response) {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        await JwtToken.destroy({ where: { token } });
        
        return res.status(204).send();
    }
}

export default new AuthController();
