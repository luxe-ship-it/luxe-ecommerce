import express from 'express';
import { prisma } from '../../db';
import { authenticateToken, authorizeRole } from '../../middleware/auth';
import { adminOrderRouter } from './orders';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole('ADMIN'));

router.use(adminOrderRouter);

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();
        const totalRevenueResult = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { not: 'CANCELLED' } }
        });
        const totalProducts = await prisma.product.count();

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenueResult._sum.totalAmount || 0,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: { select: { name: true, email: true } }, payment: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

router.put('/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
});

export const adminRouter = router;
