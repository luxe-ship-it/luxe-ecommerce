import express from 'express';
import { prisma } from '../../db';
import { authenticateToken, authorizeRole } from '../../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// Get announcement
router.get('/announcement', async (req, res) => {
    try {
        const setting = await prisma.siteSettings.findUnique({
            where: { key: 'announcement' }
        });
        // Default announcement if not set
        const defaultAnnouncement = "🎉 Happy New Year 2026";
        res.json({ message: setting?.value || defaultAnnouncement });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcement' });
    }
});

// Update announcement (Admin only)
const updateAnnouncementSchema = z.object({
    message: z.string().min(1)
});

router.put('/announcement', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        const { message } = updateAnnouncementSchema.parse(req.body);

        const setting = await prisma.siteSettings.upsert({
            where: { key: 'announcement' },
            update: { value: message },
            create: { key: 'announcement', value: message }
        });

        res.json(setting);
    } catch (error) {
        res.status(400).json({ message: 'Error updating announcement', error });
    }
});

export const settingsRouter = router;
