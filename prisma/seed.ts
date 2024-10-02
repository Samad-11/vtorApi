import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("superadmin", 10)

    const superAdmin = await prisma.user.create({
        data: {
            email: 'superadmin@mail.com',
            name: 'Super Admin',
            role: 'SUPERADMIN',
            password: hashedPassword,
            phone: '0000000000',
        }
    })
    console.log("Super Admin created : ", superAdmin.name);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    }).finally(async () => {
        await prisma.$disconnect()
    })