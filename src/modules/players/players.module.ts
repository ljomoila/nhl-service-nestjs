import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { NhlModule } from "src/modules/integrations/nhl.module";
import { PlayersController } from "./players.controller";
import { PlayersService } from "./players.service";

@Module({
  imports: [PrismaModule, NhlModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
