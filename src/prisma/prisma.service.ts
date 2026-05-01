import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const connectionString = `${process.env.DATABASE_URL}`;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");

    if (!fs.existsSync(dbPath)) {
      throw new Error(
        `❌ DB FILE NOT FOUND at: ${dbPath}. Please ensure the database file exists and the path is correct.`,
      );
    }

    const adapter = new PrismaBetterSqlite3({ url: dbPath });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
