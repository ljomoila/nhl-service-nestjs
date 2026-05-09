import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { NhlModule } from "src/modules/integrations/nhl.module";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
  imports: [PrismaModule, NhlModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
