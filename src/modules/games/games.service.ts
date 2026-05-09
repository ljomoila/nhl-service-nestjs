import { Injectable } from "@nestjs/common";
import { NhlService } from "src/modules/integrations/nhl.service";
import {
  GameBoxscoreDTO,
  GameGoalieStatsDTO,
  GamePlayerStatsDTO,
  GameTeamDTO,
} from "./dto/games";
import { PrismaService } from "src/prisma/prisma.service";
import {
  NhlBoxscore,
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
      const gameBoxscore = this.buildGameBoxscoreDTO(game) as GameBoxscoreDTO;
      gameBoxscore.homeTeam = await this.buildTeamDTO(game.homeTeam);
      gameBoxscore.homeTeam.players = await this.buildTeamPlayers(
        game.playerByGameStats.homeTeam,
      );
      gameBoxscore.awayTeam = await this.buildTeamDTO(game.awayTeam);
      gameBoxscore.awayTeam.players = await this.buildTeamPlayers(
        game.playerByGameStats.awayTeam,
      );
      gamesWithBoxScore.push(gameBoxscore);
    }

    return gamesWithBoxScore;
  }

  private buildGameBoxscoreDTO(game: NhlBoxscore): Partial<GameBoxscoreDTO> {
    return {
      gameId: game.id,
      period: game.gameState === "Final" ? 3 : 1,
      timeRemaining: game.clock.timeRemaining,
    };
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

      const playerStats = this.buildPlayerStatsDTO(player);

      const prismaPlayer = await this.prismaService.player.findUnique({
        where: { nhlId: player.playerId },
      });
      playerStats.country = prismaPlayer?.nationality || "Unknown";
      playerStats.name = prismaPlayer?.lastName || player.name.default;

      playersWithStats.push(playerStats);
    }

    for (const goalie of players.goalies) {
      if (goalie.saves === 0) {
        continue; // Skip goalies without stats
      }

      const goalieStats = this.buildPlayerStatsDTO(
        goalie,
      ) as GameGoalieStatsDTO;
      goalieStats.toi = goalie.toi;
      goalieStats.saves = goalie.saves;
      goalieStats.shotsAgainst = goalie.shotsAgainst;
      goalieStats.goalsAgainst = goalie.goalsAgainst;

      const prismaGoalie = await this.prismaService.player.findUnique({
        where: { nhlId: goalie.playerId },
      });
      goalieStats.country = prismaGoalie?.nationality || "Unknown";
      goalieStats.name = prismaGoalie?.lastName || goalie.name.default;

      playersWithStats.push(goalieStats);
    }

    return playersWithStats;
  }

  private buildPlayerStatsDTO(
    player: NhlBoxscorePlayerStats,
  ): GamePlayerStatsDTO | GameGoalieStatsDTO {
    return {
      name: player.name.default,
      position: player.position,
      goals: player.goals,
      assists: player.assists,
      country: "Unknown", // Placeholder, will be updated with actual country
    };
  }
}
