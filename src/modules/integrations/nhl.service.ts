import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import {
  NhlBoxscore,
  NhlGamesByDate,
  NhlNow,
  NhlPlayerSeasonStats,
  NhlPlayerStats,
  NhlTeam,
  NhlTeamRoster,
} from "./nhl.types";

@Injectable()
export class NhlService {
  private readonly logger = new Logger(NhlService.name);
  private readonly http: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    const baseURL = this.config.get<string>("NHL_API_BASE_URL");

    if (!baseURL) {
      throw new Error("NHL_API_BASE_URL is not defined");
    }

    this.http = axios.create({
      baseURL,
      timeout: 5000,
    });
  }

  async getTeams(): Promise<NhlTeam[]> {
    const { data } = await this.http.get<NhlNow>("/standings/now");

    if (!data) {
      throw new InternalServerErrorException("No data received from NHL API");
    }

    return data.standings;
  }

  async getRoster(teamAbbreviation: string): Promise<NhlTeamRoster> {
    const { data } = await this.http.get<NhlTeamRoster>(
      `/roster/${teamAbbreviation}/current`,
    );

    if (!data) {
      throw new InternalServerErrorException(
        `No roster data found for team ${teamAbbreviation}`,
      );
    }

    return data;
  }

  async getPlayersCurrentSeasonStats(
    playerId: number,
  ): Promise<NhlPlayerStats> {
    const { data } = await this.http.get<NhlPlayerSeasonStats>(
      `/player/${playerId}/landing`,
    );

    if (!data) {
      throw new InternalServerErrorException(
        `No data received from NHL API for player ${playerId}`,
      );
    }

    if (!data.featuredStats) {
      throw new NotFoundException(`No stats found for player ${playerId}`);
    }

    const currentSeason = data.featuredStats.season;
    const currentSeasonStats = data.seasonTotals.find(
      (s: NhlPlayerStats) => s.season === currentSeason,
    );

    if (!currentSeasonStats) {
      throw new NotFoundException(
        `No stats found for player ${playerId} in season ${currentSeason}`,
      );
    }

    return { ...currentSeasonStats, id: playerId };
  }

  async getGamesByDate(date: string): Promise<NhlBoxscore[]> {
    const { data } = await this.http.get<NhlGamesByDate>(`/schedule/${date}`);

    if (!data) {
      throw new InternalServerErrorException(
        `No data received from NHL API for date ${date}`,
      );
    }

    if (!data.gameWeek) {
      throw new NotFoundException(`No games found for date ${date}`);
    }

    const gameWeek = data.gameWeek.find(
      (gw: { date: string }) => gw.date === date,
    );

    if (!gameWeek || gameWeek.games.length === 0) {
      throw new NotFoundException(
        `No games found for date ${date} and no next start date available`,
      );
    }

    return await Promise.all(
      gameWeek.games.map(async (game) => ({
        ...(await this.getGameBoxscore(game.id)),
        periodDescriptor: game.periodDescriptor,
      })),
    );
  }

  async getGameBoxscore(gameId: number): Promise<NhlBoxscore> {
    const res = await this.http.get<NhlBoxscore>(
      `/gamecenter/${gameId}/boxscore`,
    );

    if (!res.data) {
      throw new InternalServerErrorException(
        `No boxscore data found for game ${gameId}`,
      );
    }

    return res.data;
  }
}
