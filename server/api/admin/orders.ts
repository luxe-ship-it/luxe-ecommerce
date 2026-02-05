import express from 'express';
import { prisma } from '../../db';
import { authenticateToken, authorizeRole } from '../../middleware/auth';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole('ADMIN'));

// Update shipping status
router.patch('/orders/:id/shipping', async (req, res) => {
    try {
        const { status, trackingNumber, shippedAt } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: req.params.id }
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        const updateData: any = { status };

        if (status === 'SHIPPED') {
            updateData.shippedAt = shippedAt ? new Date(shippedAt) : new Date();
            if (trackingNumber) {
                updateData.trackingNumber = trackingNumber;
            }
        } else if (status === 'DELIVERED') {
            updateData.deliveredAt = new Date();
        }

        const updatedOrder = await (prisma as any).order.update({
            where: { id: req.params.id },
            data: updateData
        });

        res.json({
            message: 'Shipping status updated',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Shipping update error:', error);
        res.status(500).json({ message: 'Error updating shipping status', error });
    }
});

// Mark order as delivered
router.patch('/orders/:id/delivery', async (req, res) => {
    try {
        const { deliveredAt } = req.body;

        const updatedOrder = await (prisma as any).order.update({
            where: { id: req.params.id },
            data: {
                status: 'DELIVERED',
                deliveredAt: deliveredAt ? new Date(deliveredAt) : new Date()
            }
        });

        res.json({
            message: 'Order marked as delivered',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Delivery update error:', error);
        res.status(500).json({ message: 'Error updating delivery status', error });
    }
});

// Get all return requests
router.get('/returns', async (req, res) => {
    try {
        const returns = await (prisma as any).orderReturn.findMany({
            include: {
                order: {
                    include: {
                        user: { select: { name: true, email: true } },
                        items: { include: { product: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(returns);
    } catch (error) {
        console.error('Returns fetch error:', error);
        res.status(500).json({ message: 'Error fetching returns', error });
    }
});

// Update return status (approve/reject)
router.patch('/returns/:id/status', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        const returnRequest = await (prisma as any).orderReturn.findUnique({
            where: { id: req.params.id },
            include: { order: true }
        });

        if (!returnRequest) {
            res.status(404).json({ message: 'Return request not found' });
            return;
        }

        const updateData: any = { status };

        if (status === 'APPROVED') {
            updateData.approvedAt = new Date();
        }

        if (adminNotes) {
            updateData.adminNotes = adminNotes;
        }

        const updatedReturn = await (prisma as any).orderReturn.update({
            where: { id: req.params.id },
            data: updateData
        });

        // If approved and it's a return (not exchange), create refund
        if (status === 'APPROVED' && returnRequest.type === 'RETURN') {
            await (prisma as any).refund.create({
                data: {
                    orderId: returnRequest.orderId,
                    amount: returnRequest.order.totalAmount,
                    method: 'ORIGINAL_PAYMENT',
                    reason: 'RETURN',
                    status: 'PENDING'
                }
            });
        }

        res.json({
            message: `Return request ${status.toLowerCase()}`,
            returnRequest: updatedReturn
        });
    } catch (error) {
        console.error('Return status update error:', error);
        res.status(500).json({ message: 'Error updating return status', error });
    }
});

// Get all refunds
router.get('/refunds', async (req, res) => {
    try {
        const refunds = await (prisma as any).refund.findMany({
            include: {
                order: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(refunds);
    } catch (error) {
        console.error('Refunds fetch error:', error);
        res.status(500).json({ message: 'Error fetching refunds', error });
    }
});

// Process refund
router.post('/refunds/:id/process', async (req, res) => {
    try {
        const { method, transactionId } = req.body;

        const refund = await (prisma as any).refund.update({
            where: { id: req.params.id },
            data: {
                status: 'PROCESSING',
                method: method || 'ORIGINAL_PAYMENT',
                transactionId: transactionId || null
            }
        });

        res.json({
            message: 'Refund processing initiated',
            refund
        });
    } catch (error) {
        console.error('Refund processing error:', error);
        res.status(500).json({ message: 'Error processing refund', error });
    }
});

// Complete refund
router.post('/refunds/:id/complete', async (req, res) => {
    try {
        const { transactionId, notes } = req.body;

        const refund = await (prisma as any).refund.update({
            where: { id: req.params.id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                transactionId: transactionId || undefined,
                notes: notes || undefined
            }
        });

        res.json({
            message: 'Refund completed successfully',
            refund
        });
    } catch (error) {
        console.error('Refund completion error:', error);
        res.status(500).json({ message: 'Error completing refund', error });
    }
});

export const adminOrderRouter = router;
