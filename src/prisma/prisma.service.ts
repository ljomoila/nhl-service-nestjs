import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
    const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");

    if (!fs.existsSync(dbPath)) {
      throw new Error(
        `❌ DB FILE NOT FOUND at: ${dbPath}. Please ensure the database file exists and the path is correct.`,
      );
    }

    const adapter = new PrismaBetterSqlite3({ url: dbPath });

    super({ adapter });

    // Extend PrismaClient to add cache invalidation hooks
    return this.$extends({
      query: {
        team: {
          async create({ args, query }) {
            const result = await query(args);
            await cache.del("teams:all");
            return result;
          },

          async update({ args, query }) {
            const result = await query(args);
            await cache.del("teams:all");
            return result;
          },

          async delete({ args, query }) {
            const result = await query(args);
            await cache.del("teams:all");
            return result;
          },
        },
      },
    }) as any;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
