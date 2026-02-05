import express from 'express';
import { prisma } from '../../db';
import { authenticateToken, authorizeRole } from '../../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const createCouponSchema = z.object({
    code: z.string().min(3).toUpperCase(),
    type: z.enum(['FLAT', 'PERCENTAGE']),
    value: z.number().min(0),
    minOrder: z.number().optional(),
    maxDiscount: z.number().optional(),
    usageLimit: z.number().optional(),
    expiresAt: z.string().optional(), // ISO date string
});

// Create Coupon (Admin)
router.post('/', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        const data = createCouponSchema.parse(req.body);

        // Check if code exists
        const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
        if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

        const coupon = await prisma.coupon.create({
            data: {
                code: data.code,
                type: data.type,
                value: data.value,
                minOrder: data.minOrder,
                maxDiscount: data.maxDiscount,
                usageLimit: data.usageLimit,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            }
        });
        res.json(coupon);
    } catch (error) {
        res.status(400).json({ message: 'Error creating coupon', error });
    }
});

// List Coupons (Admin)
router.get('/', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { id: 'desc' }
        });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupons' });
    }
});

// Delete Coupon (Admin)
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        await prisma.coupon.delete({ where: { id: req.params.id as string } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting coupon' });
    }
});

// Apply/Validate Coupon (User)
router.post('/apply', authenticateToken, async (req, res) => {
    try {
        const { code, cartTotal } = z.object({
            code: z.string(),
            cartTotal: z.number()
        }).parse(req.body);

        const coupon = await prisma.coupon.findUnique({ where: { code } });

        if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });

        // Validation checks
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return res.status(400).json({ message: 'Coupon expired' });
        }
        if (coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }
        if (coupon.minOrder && cartTotal < Number(coupon.minOrder)) {
            return res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrder} required` });
        }

        // Calculate Discount
        let discountAmount = 0;
        if (coupon.type === 'FLAT') {
            discountAmount = Number(coupon.value);
        } else {
            discountAmount = (cartTotal * Number(coupon.value)) / 100;
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
            }
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, cartTotal);

        res.json({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discountAmount
        });

    } catch (error) {
        res.status(400).json({ message: 'Error applying coupon' });
    }
});

export const couponRouter = router;
