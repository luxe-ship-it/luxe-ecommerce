import express from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../../middleware/auth';
import { z } from 'zod';

const router = express.Router();

router.use(authenticateToken);

// Get Wishlist
router.get('/', async (req, res) => {
    try {
        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: req.user!.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: { category: true }
                        }
                    }
                }
            },
        });

        // If no wishlist exists, return empty items or create one?
        // Let's return empty items array if null
        if (!wishlist) {
            return res.json({ items: [] });
        }

        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

const addToWishlistSchema = z.object({
    productId: z.string(),
});

// Add Item
router.post('/items', async (req, res) => {
    try {
        const { productId } = addToWishlistSchema.parse(req.body);

        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: req.user!.id },
        });

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId: req.user!.id },
            });
        }

        const item = await prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                productId,
            },
            include: { product: true },
        });

        res.json(item);
    } catch (error) {
        // Unique constraint failed probably means already in wishlist
        res.status(400).json({ message: 'Error adding to wishlist (maybe duplicate)', error });
    }
});

// Remove Item
router.delete('/items/:productId', async (req, res) => {
    try {
        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: req.user!.id },
        });

        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        await prisma.wishlistItem.deleteMany({
            where: {
                wishlistId: wishlist.id,
                productId: req.params.productId,
            },
        });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
});

export const wishlistRouter = router;
