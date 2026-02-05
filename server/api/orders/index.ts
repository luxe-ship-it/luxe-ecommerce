import express from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../../middleware/auth';
import { z } from 'zod';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user!.id },
            include: { items: { include: { product: true } }, payment: true, returns: { orderBy: { requestedAt: 'desc' } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

const createOrderSchema = z.object({
    shippingAddress: z.any(),
    couponCode: z.string().optional(),
    paymentMethod: z.enum(['ONLINE', 'COD']).optional(),
});

// Create Order from Cart
router.post('/', async (req, res) => {
    try {
        const { shippingAddress, couponCode, paymentMethod } = createOrderSchema.parse(req.body);

        const cart = await prisma.cart.findUnique({
            where: { userId: req.user!.id },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: 'Cart is empty' });
            return;
        }

        let totalAmount = cart.items.reduce((sum, item) => {
            return sum + (Number(item.product.basePrice) * item.quantity);
        }, 0);

        let couponId = null;

        // Apply Coupon Logic
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            if (coupon) {
                // Validation
                if ((!coupon.expiresAt || new Date() <= coupon.expiresAt) &&
                    (!coupon.usageLimit || coupon.currentUsage < coupon.usageLimit) &&
                    (!coupon.minOrder || totalAmount >= Number(coupon.minOrder))) {

                    let discount = 0;
                    if (coupon.type === 'FLAT') {
                        discount = Number(coupon.value);
                    } else {
                        discount = (totalAmount * Number(coupon.value)) / 100;
                        if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
                    }
                    totalAmount = Math.max(0, totalAmount - discount);
                    couponId = coupon.id;
                }
            }
        }

        // Transaction to create order, clear cart, record coupon usage, and update stock for COD
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: req.user!.id,
                    totalAmount,
                    paymentMethod: (paymentMethod || 'ONLINE') as 'ONLINE' | 'COD',
                    shippingAddress,
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.basePrice
                        }))
                    }
                },
                include: { items: true },
            });

            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            if (couponId) {
                await tx.couponUsage.create({
                    data: {
                        orderId: newOrder.id,
                        couponId: couponId,
                        userId: req.user!.id
                    }
                });

                await tx.coupon.update({
                    where: { id: couponId },
                    data: { currentUsage: { increment: 1 } }
                });
            }

            // Decrement stock for COD orders immediately (online orders decrement after payment)
            if (paymentMethod === 'COD') {
                for (const item of newOrder.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
            }

            return newOrder;
        });

        res.json(order);
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: 'Error creating order', error });
    }
});

// Cancel Order (within 12 hours, not shipped)
router.post('/:id/cancel', async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { items: true, payment: true }
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        // Check ownership or admin
        if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // Check 12-hour window
        const orderAge = Date.now() - new Date(order.createdAt).getTime();
        const twelveHours = 12 * 60 * 60 * 1000;

        if (orderAge > twelveHours) {
            res.status(400).json({ message: 'Cancellation window expired (12 hours)' });
            return;
        }

        // Check if already shipped or delivered
        if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
            res.status(400).json({ message: 'Cannot cancel shipped orders' });
            return;
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' }
        });

        // Restore inventory
        for (const item of order.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } }
            });
        }

        // Create refund if payment was completed
        let refund = null;
        if (order.payment && order.payment.status === 'COMPLETED') {
            refund = await prisma.refund.create({
                data: {
                    orderId: order.id,
                    amount: order.totalAmount,
                    method: 'ORIGINAL_PAYMENT',
                    reason: 'CANCELLATION',
                    status: 'PENDING'
                }
            });
        }

        res.json({
            message: 'Order cancelled successfully',
            order: updatedOrder,
            refund: refund ? {
                id: refund.id,
                amount: refund.amount,
                status: refund.status,
                estimatedDays: 7
            } : null
        });
    } catch (error) {
        console.error('Order cancellation error:', error);
        res.status(500).json({ message: 'Error cancelling order', error });
    }
});

// Check return eligibility
router.get('/:id/return-eligibility', async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { returns: true }
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (order.userId !== req.user!.id) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // Check if order is delivered
        if (order.status !== 'DELIVERED' || !(order as any).deliveredAt) {
            res.json({
                eligible: false,
                reason: 'Order not delivered yet',
                status: order.status
            });
            return;
        }

        // Check if return already requested
        if ((order as any).returns && (order as any).returns.length > 0) {
            res.json({
                eligible: false,
                reason: 'Return already requested',
                returnId: (order as any).returns[0].id
            });
            return;
        }

        // Check 3-day window
        const deliveryAge = Date.now() - new Date((order as any).deliveredAt).getTime();
        const threeDays = 3 * 24 * 60 * 60 * 1000;

        if (deliveryAge > threeDays) {
            res.json({
                eligible: false,
                reason: 'Return window expired (3 days)',
                deliveredAt: (order as any).deliveredAt
            });
            return;
        }

        const daysRemaining = Math.ceil((threeDays - deliveryAge) / (24 * 60 * 60 * 1000));
        const expiresAt = new Date(new Date((order as any).deliveredAt).getTime() + threeDays);

        res.json({
            eligible: true,
            reason: 'Within 3-day window',
            daysRemaining,
            expiresAt
        });
    } catch (error) {
        console.error('Return eligibility check error:', error);
        res.status(500).json({ message: 'Error checking eligibility', error });
    }
});

// Request return/exchange
router.post('/:id/return', async (req, res) => {
    try {
        const { type, reason, images } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { returns: true }
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (order.userId !== req.user!.id) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // Validate eligibility
        if (order.status !== 'DELIVERED' || !(order as any).deliveredAt) {
            res.status(400).json({ message: 'Order not delivered yet' });
            return;
        }

        if ((order as any).returns && (order as any).returns.length > 0) {
            res.status(400).json({ message: 'Return already requested' });
            return;
        }

        const deliveryAge = Date.now() - new Date((order as any).deliveredAt).getTime();
        const threeDays = 3 * 24 * 60 * 60 * 1000;

        if (deliveryAge > threeDays) {
            res.status(400).json({ message: 'Return window expired (3 days)' });
            return;
        }

        // Create return request
        const returnRequest = await prisma.orderReturn.create({
            data: {
                orderId: order.id,
                type: type || 'RETURN',
                reason,
                images: images || [],
                status: 'REQUESTED'
            }
        });

        res.json({
            message: 'Return request submitted successfully',
            returnRequest: {
                id: returnRequest.id,
                type: returnRequest.type,
                status: returnRequest.status,
                requestedAt: returnRequest.requestedAt
            }
        });
    } catch (error) {
        console.error('Return request error:', error);
        res.status(500).json({ message: 'Error submitting return request', error });
    }
});

export const orderRouter = router;
