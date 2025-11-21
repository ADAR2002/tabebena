import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    // Helper method for transactions
    async transaction<T>(fn: (prisma: PrismaService) => Promise<T>): Promise<T> {
        return this.$transaction(fn);
    }
}
