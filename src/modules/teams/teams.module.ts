import { Module } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamsController } from "./teams.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { NhlModule } from "src/modules/integrations/nhl.module";

@Module({
  imports: [PrismaModule, NhlModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
