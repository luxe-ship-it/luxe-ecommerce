import express from 'express';
import { prisma } from '../../db';
import { authenticateToken, authorizeRole } from '../../middleware/auth';
import { z } from 'zod';
import multer from 'multer';
import cloudinary from '../../utils/cloudinary';
import { Readable } from 'stream';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        Readable.from(buffer).pipe(stream);
    });
};

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;

    const where: any = {};

    if (category) {
        where.category = { name: category as string };
    }
    if (search) {
        where.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
        ];
    }
    if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice.gte = Number(minPrice);
        if (maxPrice) where.basePrice.lte = Number(maxPrice);
    }
    if (featured === 'true') {
        where.isFeatured = true;
    }

    const orderBy: any = {};
    if (sort === 'price_asc') orderBy.basePrice = 'asc';
    if (sort === 'price_desc') orderBy.basePrice = 'desc';
    if (sort === 'newest') orderBy.createdAt = 'desc';

    try {
        const products = await prisma.product.findMany({
            where,
            include: { category: true, variants: true, reviews: true },
            orderBy,
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get all categories
router.get('/categories', async (_req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: {
                category: true,
                variants: true,
                reviews: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            },
        });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Add Review
const createReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

router.post('/:id/reviews', authenticateToken, async (req, res) => {
    try {
        const { rating, comment } = createReviewSchema.parse(req.body);
        const userId = (req as any).user.id;
        const productId = String(req.params.id);

        const review = await prisma.review.create({
            data: {
                userId,
                productId,
                rating,
                comment,
            },
            include: { user: { select: { name: true } } }
        });
        res.json(review);
    } catch (error) {
        res.status(400).json({ message: 'Error adding review', error });
    }
});


// Admin routes
const createProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    basePrice: z.coerce.number(),
    originalPrice: z.coerce.number().optional(),
    stock: z.coerce.number(),
    categoryId: z.string(),
    images: z.array(z.string()).optional(),
    isFeatured: z.union([z.boolean(), z.string().transform(val => val === 'true')]).optional(),
});

router.post('/', authenticateToken, authorizeRole('ADMIN'), upload.single('image'), async (req, res) => {
    try {
        let imageUrls: string[] = [];

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrls.push(result.secure_url);
        }

        // Handle existing images passed as fields (if any)
        if (req.body.image) {
            imageUrls.push(req.body.image);
        }

        const payload = {
            ...req.body,
            images: imageUrls,
        };

        const data = createProductSchema.parse(payload);
        const { categoryId, name, description, basePrice, originalPrice, stock, images, isFeatured } = data;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                basePrice,
                originalPrice,
                stock,
                images: images || [],
                isFeatured: isFeatured || false,
                category: { connect: { id: categoryId } },
            },
        });
        res.json(product);
    } catch (error) {
        console.error("Product creation error:", error);
        res.status(400).json({ message: 'Error creating product', error });
    }
});

router.put('/:id', authenticateToken, authorizeRole('ADMIN'), upload.single('image'), async (req, res) => {
    try {
        let imageUrls: string[] = [];

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrls.push(result.secure_url);
        }

        // Handle existing images coming from potential JSON body or fields
        if (req.body.images) { // if sent as array/string
            if (typeof req.body.images === 'string') {
                try {
                    const parsed = JSON.parse(req.body.images);
                    if (Array.isArray(parsed)) imageUrls = [...imageUrls, ...parsed];
                    else imageUrls.push(req.body.images);
                } catch {
                    imageUrls.push(req.body.images);
                }
            } else if (Array.isArray(req.body.images)) {
                imageUrls = [...imageUrls, ...req.body.images];
            }
        }
        // If simply 'image' field was used in some client logic
        if (req.body.image) {
            imageUrls.push(req.body.image);
        }


        // Extract categoryId similar to before
        const { categoryId, ...rest } = req.body;

        // We merged new images with potential existing ones? 
        // Existing logic in dashboard sends "images: [url]". 
        // If we upload new file, we might want to replace or add. 
        // Usually replacement for single image field.
        // If we have a file, let's prioritize it as the main image or append?
        // Let's assume replacement if file is provided, or append.
        // For simplicity: if file provided, use it. if also body images, append them.

        const updateData: any = {
            ...rest,
            basePrice: rest.basePrice ? Number(rest.basePrice) : undefined,
            originalPrice: rest.originalPrice ? Number(rest.originalPrice) : undefined,
            stock: rest.stock ? Number(rest.stock) : undefined,
            isFeatured: rest.isFeatured === 'true' || rest.isFeatured === true,
        };

        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        if (categoryId) {
            updateData.category = { connect: { id: categoryId } };
        }

        const product = await prisma.product.update({
            where: { id: String(req.params.id) },
            data: updateData,
        });
        res.json(product);
    } catch (error) {
        console.error("Product update error:", error);
        res.status(400).json({ message: 'Error updating product', error });
    }
});

router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    try {
        await prisma.product.delete({
            where: { id: String(req.params.id) },
        });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

export const productRouter = router;
