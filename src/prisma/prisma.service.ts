import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbPath =
      process.env.DATABASE_URL?.replace("file:", "") ?? "/data/prod.db";

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
