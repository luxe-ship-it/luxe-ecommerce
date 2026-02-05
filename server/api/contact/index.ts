import express from 'express';
import { prisma } from '../../db';
import { z } from 'zod';
import { authenticateToken, authorizeRole } from '../../middleware/auth';

const router = express.Router();

const createContactQuerySchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(1),
});

// Create contact query (public)
router.post('/', async (req, res) => {
    try {
        const data = createContactQuerySchema.parse(req.body);

        const query = await prisma.contactQuery.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                subject: data.subject,
                message: data.message,
            }
        });

        res.json({ message: 'Query submitted successfully', id: query.id });
    } catch (error) {
        console.error('Contact query creation error:', error);
        res.status(500).json({ message: 'Error submitting query', error });
    }
});

// Get all contact queries (admin only)
router.get('/', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        const queries = await prisma.contactQuery.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching queries', error });
    }
});

// Update query status (admin only)
router.patch('/:id/status', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        const { status } = req.body;

        if (!['PENDING', 'REPLIED', 'RESOLVED'].includes(status)) {
            res.status(400).json({ message: 'Invalid status' });
            return;
        }

        const query = await prisma.contactQuery.update({
            where: { id: String(req.params.id) },
            data: { status }
        });

        res.json(query);
    } catch (error) {
        res.status(500).json({ message: 'Error updating query status', error });
    }
});

// Delete query (admin only)
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        await prisma.contactQuery.delete({
            where: { id: String(req.params.id) }
        });
        res.json({ message: 'Query deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting query', error });
    }
});

export const contactRouter = router;
