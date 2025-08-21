import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

class PrismaService {
    constructor() {
        if (PrismaService.instance) {
            return PrismaService.instance;
        }

        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.PRISMA_DATABASE_URL
                }
            },
            // Connection pool configuration
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
        }).$extends(withAccelerate())

        PrismaService.instance = this;
    }

    getClient() {
        return this.prisma;
    }

    async disconnect() {
        await this.prisma.$disconnect();
    }
}

export default new PrismaService();
