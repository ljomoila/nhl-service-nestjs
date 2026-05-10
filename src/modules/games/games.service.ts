import { Injectable } from "@nestjs/common";
import { NhlService } from "src/modules/integrations/nhl.service";
import {
  GameBoxscoreDTO,
  GameGoalieStatsDTO,
  GamePlayerStatsDTO,
  GameTeamDTO,
} from "./dto/games.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  NhlBoxscoreGoalieStats,
  NhlBoxscorePlayers,
  NhlBoxscorePlayerStats,
  NhlBoxscoreTeam,
} from "../integrations/nhl.types";

@Injectable()
export class GamesService {
  constructor(
    private readonly nhlService: NhlService,
    private readonly prismaService: PrismaService,
  ) {}

  public async getGamesByDate(date: string): Promise<GameBoxscoreDTO[]> {
    const games = await this.nhlService.getGamesByDate(date);

    const gamesWithBoxScore: GameBoxscoreDTO[] = [];
    for (const game of games) {
      const gameBoxscore = new GameBoxscoreDTO();
      gameBoxscore.gameId = game.id;
      gameBoxscore.period =
        game.periodDescriptor.periodType === "OT"
          ? `OT`
          : `${game.periodDescriptor.number}`;
      gameBoxscore.timeRemaining = game.clock?.timeRemaining ?? "00:00";
      gameBoxscore.status = game.gameState;

      gameBoxscore.homeTeam = await this.buildTeamDTO(game.homeTeam);
      gameBoxscore.awayTeam = await this.buildTeamDTO(game.awayTeam);

      if (game.playerByGameStats) {
        gameBoxscore.homeTeam.players = await this.buildTeamPlayers(
          game.playerByGameStats.homeTeam,
        );
        gameBoxscore.awayTeam.players = await this.buildTeamPlayers(
          game.playerByGameStats.awayTeam,
        );
      }

      gamesWithBoxScore.push(gameBoxscore);
    }

    return gamesWithBoxScore;
  }

  private async buildTeamDTO(nhlTeam: NhlBoxscoreTeam): Promise<GameTeamDTO> {
    return {
      id: nhlTeam.id,
      abbreviation: nhlTeam.abbrev,
      name: nhlTeam.commonName.default,
      score: nhlTeam.score,
      players: [],
    };
  }

  private async buildTeamPlayers(
    players: NhlBoxscorePlayers,
  ): Promise<GamePlayerStatsDTO[]> {
    const playersWithStats: GamePlayerStatsDTO[] = [];

    const nhlPlayers = [...players.forwards, ...players.defense];
    for (const player of nhlPlayers) {
      if (player.goals === 0 && player.assists === 0) {
        continue; // Skip players without points
      }

      playersWithStats.push(
        (await this.buildPlayerStatsDTO(player)) as GamePlayerStatsDTO,
      );
    }

    for (const goalie of players.goalies) {
      if (goalie.saves === 0) {
        continue; // Skip goalies without stats
      }

      playersWithStats.push(
        (await this.buildGoalieStatsDTO(goalie)) as GameGoalieStatsDTO,
      );
    }

    return playersWithStats;
  }

  private async buildPlayerStatsDTO(
    player: NhlBoxscorePlayerStats,
  ): Promise<Partial<GamePlayerStatsDTO | GameGoalieStatsDTO>> {
    return {
      id: player.playerId,
      name: player.name.default,
      position: player.position,
      goals: player.goals,
      assists: player.assists,
      ...(await this.buildPlayerDetailsFromDB(player.playerId)),
    };
  }

  private async buildGoalieStatsDTO(
    goalie: NhlBoxscoreGoalieStats,
  ): Promise<Partial<GameGoalieStatsDTO>> {
    return {
      ...(await this.buildPlayerStatsDTO(goalie)),
      toi: goalie.toi,
      saves: goalie.saves,
      shotsAgainst: goalie.shotsAgainst,
      goalsAgainst: goalie.goalsAgainst,
      savePercentage: (goalie.saves / goalie.shotsAgainst) * 100,
    };
  }

  /**
   * Fetches additional player details from the database to enrich the stats DTO.
   */
  private async buildPlayerDetailsFromDB(
    playerId: number,
  ): Promise<Partial<GamePlayerStatsDTO>> {
    const prismaPlayer = await this.prismaService.player.findUnique({
      where: { nhlId: playerId },
    });

    return {
      country: prismaPlayer?.nationality || "Unknown",
      name: prismaPlayer?.lastName || "Unknown",
    };
  }
}
