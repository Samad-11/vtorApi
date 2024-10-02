"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash("superadmin", 10);
    const superAdmin = await prisma.user.create({
        data: {
            email: 'superadmin@mail.com',
            name: 'Super Admin',
            role: 'SUPERADMIN',
            password: hashedPassword,
            phone: '0000000000',
        }
    });
    console.log("Super Admin created : ", superAdmin.name);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
