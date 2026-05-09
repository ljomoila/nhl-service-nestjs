import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { SyncService } from "./sync.service";
import { NhlModule } from "src/modules/integrations/nhl.module";

@Module({
  imports: [PrismaModule, NhlModule, PrismaModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
