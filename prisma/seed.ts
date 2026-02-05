import "dotenv/config";
import { prisma } from "../server/db";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Seeding database...");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@luxe.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: "ADMIN" }, // Ensure role is ADMIN even if exists
        create: {
            email: adminEmail,
            name: "Admin User",
            passwordHash: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("Admin user ready:", admin.email);

    // Seed categories
    const categories = ["shoes", "purses"];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat }
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
