import { Injectable } from "@nestjs/common";
import { PlayerDTO, PlayerWithSeasonStatsDTO } from "./dto/player.dto";
import { NhlService } from "src/modules/integrations/nhl.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NhlPlayerStats } from "../integrations/nhl.types";

@Injectable()
export class PlayersService {
  constructor(
    private readonly nhlService: NhlService,
    private readonly prismaService: PrismaService,
  ) {}

  public async getPlayers(): Promise<PlayerDTO[]> {
    return await this.prismaService.player.findMany();
  }

  public async getPlayer(playerId: number): Promise<PlayerDTO | null> {
    return await this.prismaService.player.findUniqueOrThrow({
      where: { nhlId: playerId },
    });
  }

  public async getCurrentSeasonStats(
    nhlId: number,
  ): Promise<PlayerWithSeasonStatsDTO> {
    const nhlStats = await this.nhlService.getPlayersCurrentSeasonStats(nhlId);

    return await this.buildPlayerWithSeasonStatsDTO(nhlStats);
  }

  private async buildPlayerWithSeasonStatsDTO(
    stats: NhlPlayerStats,
  ): Promise<PlayerWithSeasonStatsDTO> {
    const prismaPlayer = await this.prismaService.player.findUniqueOrThrow({
      where: { nhlId: stats.id },
    });

    return {
      id: prismaPlayer.id,
      nhlId: stats.id,
      fullName: prismaPlayer.fullName,
      firstName: prismaPlayer.firstName,
      lastName: prismaPlayer.lastName,
      playerType: prismaPlayer.playerType,
      nationality: prismaPlayer.nationality,
      position: stats.position,
      gamesPlayed: stats.gamesPlayed,
      goals: stats.goals,
      assists: stats.assists,
      points: stats.points,
      plusMinus: stats.plusMinus,
      pim: stats.pim,
      powerPlayGoals: stats.powerPlayGoals,
      powerPlayPoints: stats.powerPlayPoints,
      shorthandedGoals: stats.shorthandedGoals,
      shorthandedPoints: stats.shorthandedPoints,
      shootingPctg: stats.shootingPctg,
      avgToi: stats.avgToi,
      faceoffWinningPctg: stats.faceoffWinningPctg,
      gameWinningGoals: stats.gameWinningGoals,
      otGoals: stats.otGoals,
      penaltyMinutes: stats.pim,
      shots: stats.shots,
    };
  }
}
