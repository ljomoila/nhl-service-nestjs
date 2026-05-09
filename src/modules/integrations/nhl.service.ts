import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { NhlBoxscore, NhlGamesByDate, NhlNow } from "./nhl.types";

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

  async getTeams() {
    const res = await this.http.get<NhlNow>("/standings/now");

    if (!res.data || !res.data.standings) {
      throw new NotFoundException("No standings data found");
    }

    return res.data.standings;
  }

  async getRoster(teamAbbreviation: string) {
    const res = await this.http.get(`/roster/${teamAbbreviation}/current`);

    if (!res.data || !res.data.roster) {
      throw new NotFoundException(
        `No roster data found for team ${teamAbbreviation}`,
      );
    }

    return res.data;
  }

  async getPlayersCurrentSeasonStats(playerId: number) {
    const { data } = await this.http.get(`/player/${playerId}/landing`);

    if (!data || !data.featuredStats) {
      throw new NotFoundException(`No stats found for player ${playerId}`);
    }

    const currentSeason = data.featuredStats.season;
    const currentSeasonStats = data.seasonTotals.find(
      (s: { season: string }) => s.season === currentSeason,
    );

    if (!currentSeasonStats) {
      throw new NotFoundException(
        `No stats found for player ${playerId} in season ${currentSeason}`,
      );
    }

    this.logger.log(
      `Current season stats for player ${playerId}: ${JSON.stringify(
        currentSeasonStats,
      )}`,
    );

    return currentSeasonStats;
  }

  async getGamesByDate(date: string): Promise<NhlBoxscore[]> {
    const { data } = await this.http.get<NhlGamesByDate>(`/schedule/${date}`);

    if (!data || !data.gameWeek) {
      throw new NotFoundException(`No games found for date ${date}`);
    }

    const gameWeek = data.gameWeek.find(
      (gw: { date: string }) => gw.date === date,
    );

    if (!gameWeek || gameWeek.games.length === 0) {
      if (!data.nextStartDate) {
        throw new NotFoundException(
          `No games found for date ${date} and no next start date available`,
        );
      }

      // Try to fetch games from next date if no games found for the requested date
      return await this.getGamesByDate(data.nextStartDate);
    }

    return Promise.all(
      gameWeek.games.map(async (game) => await this.getGameBoxscore(game.id)),
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
