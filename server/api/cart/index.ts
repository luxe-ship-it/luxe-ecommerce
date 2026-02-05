import express from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../../middleware/auth';
import { z } from 'zod';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user!.id },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user!.id },
                include: { items: { include: { product: true } } },
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

const addToCartSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(1),
});

router.post('/items', async (req, res) => {
    try {
        const { productId, quantity } = addToCartSchema.parse(req.body);

        let cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: req.user!.id } });
        }

        const item = await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                cartId: cart.id,
                productId,
                quantity,
            },
            include: { product: true },
        });

        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Error adding to cart', error });
    }
});

router.put('/items/:id', async (req, res) => {
    try {
        const { quantity } = z.object({ quantity: z.number().min(1) }).parse(req.body);
        const item = await prisma.cartItem.update({
            where: { id: req.params.id },
            data: { quantity },
            include: { product: true },
        });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Error updating cart item', error });
    }
});

router.delete('/items/:id', async (req, res) => {
    try {
        await prisma.cartItem.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item' });
    }
});

export const cartRouter = router;
