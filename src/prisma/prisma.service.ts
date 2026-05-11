import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbPath = process.env.DATABASE_URL?.replace("file:", "");

    if (!dbPath) {
      throw new Error(
        "DATABASE_URL must be configured in environment variables",
      );
    }

    const adapter = new PrismaBetterSqlite3({
      url: dbPath,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
