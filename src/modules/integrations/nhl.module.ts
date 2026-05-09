import { Module } from "@nestjs/common";
import { NhlService } from "./nhl.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [NhlService],
  exports: [NhlService],
})
export class NhlModule {}
