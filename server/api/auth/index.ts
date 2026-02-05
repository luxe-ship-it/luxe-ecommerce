import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db';
import { authenticateToken } from '../../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, passwordHash, name },
        });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error });
    }
});

import { OAuth2Client } from 'google-auth-library';

// ... existing code

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(400).json({ message: 'Invalid Google Token' });
            return;
        }

        let user = await prisma.user.findUnique({ where: { email: payload.email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    name: payload.name || "Google User",
                    googleId: payload.sub,
                    // passwordHash is optional
                },
            });
        } else if (!user.googleId) {
            // Link account
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: payload.sub },
            });
        }

        const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ token: jwtToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ message: 'Google authentication failed', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(400).json({ message: 'Login failed', error });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address } });
});

router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone, address } = z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            address: z.string().optional(),
        }).parse(req.body);

        const user = await prisma.user.update({
            where: { id: req.user!.id },
            data: {
                name,
                phone,
                address
            }
        });

        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address } });
    } catch (error) {
        res.status(400).json({ message: 'Error updating profile', error });
    }
});

export const authRouter = router;
