"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// const prismaClientSingleton = () => {
//     return new PrismaClient();
// };
// declare global {
//     // eslint-disable-next-line no-var
//     var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }
// export const prisma = globalThis.prisma ?? prismaClientSingleton();
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
const prisma = new client_1.PrismaClient({
    log: ["query"],
});
exports.default = prisma;
