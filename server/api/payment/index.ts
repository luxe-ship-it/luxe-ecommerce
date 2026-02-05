import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../../db';
import { authenticateToken } from '../../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// Razorpay instance will be initialized lazily to avoid build-time errors
// const razorpay = new Razorpay({...});

router.use(authenticateToken);

const createPaymentOrderSchema = z.object({
    orderId: z.string(),
});

router.post('/create-order', async (req, res) => {
    try {
        const { orderId } = createPaymentOrderSchema.parse(req.body);
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        // Use the totalAmount from the order, which should already have any discounts applied
        const finalAmount = Number(order.totalAmount);

        const options = {
            amount: Math.round(finalAmount * 100), // amount in the smallest currency unit
            currency: "INR",
            receipt: order.id,
        };

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const razorpayOrder = await razorpay.orders.create(options);

        await prisma.payment.create({
            data: {
                orderId: order.id,
                razorpayOrderId: razorpayOrder.id,
                amount: finalAmount,
                status: 'PENDING'
            }
        });

        res.json(razorpayOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating razorpay order', error });
    }
});

const verifyPaymentSchema = z.object({
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string(),
});

router.post('/verify', async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verifyPaymentSchema.parse(req.body);

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');

        if (generatedSignature === razorpaySignature) {
            // Payment successful
            const payment = await prisma.payment.update({
                where: { razorpayOrderId },
                data: {
                    razorpayPaymentId,
                    razorpaySignature,
                    status: 'COMPLETED'
                },
            });

            const order = await prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'PROCESSING' },
                include: { items: true } // Include items to update stock
            });

            // Decrease stock
            for (const item of order.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            res.json({ status: 'success' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Signature verification failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error });
    }
});

export const paymentRouter = router;
