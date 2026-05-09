import { Injectable } from "@nestjs/common";
import { PlayerDTO, PlayerWithSeasonStatsDTO } from "./dto/player.dto";
import { NhlService } from "src/modules/integrations/nhl.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PlayersService {
  constructor(
    private readonly nhlService: NhlService,
    private readonly prismaService: PrismaService,
  ) {}

  async getPlayers(): Promise<PlayerDTO[]> {
    return await this.prismaService.player.findMany();
  }

  async getPlayer(playerId: number): Promise<PlayerDTO | null> {
    return await this.prismaService.player.findUniqueOrThrow({
      where: { nhlId: playerId },
    });
  }

  async getCurrentSeasonStats(
    nhlId: number,
  ): Promise<PlayerWithSeasonStatsDTO> {
    return await this.nhlService.getPlayersCurrentSeasonStats(nhlId);
  }
}
