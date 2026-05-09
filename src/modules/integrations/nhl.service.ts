import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { NhlBoxScore } from "./nhl.types";

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
    const res = await this.http.get("/standings/now");

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
    const res = await this.http.get(`/player/${playerId}/landing`);

    // this.logger.log(
    //   `Fetched player data for ${playerId}: ${JSON.stringify(res.data)}`,
    // );

    if (!res.data || !res.data.featuredStats) {
      throw new NotFoundException(`No stats found for player ${playerId}`);
    }

    const currentSeason = res.data.featuredStats.season;
    const currentSeasonStats = res.data.seasonTotals.find(
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

  async getGameIdsByDate(date: string): Promise<string[]> {
    const res = await this.http.get(`/schedule/${date}`);

    if (!res.data || !res.data.gameWeek) {
      throw new NotFoundException(`No games found for date ${date}`);
    }

    const { games } = res.data.gameWeek.find(
      (gw: { date: string }) => gw.date === date,
    );

    if ((!games || games.length === 0) && res.data.nextStartDate) {
      // Get games from next date if no games found for the requested date
      return await this.getGameIdsByDate(res.data.nextStartDate);
    }

    return games.map((game: { id: string }) => game.id);
  }

  async getGameBoxscore(gameId: string): Promise<NhlBoxScore> {
    const res = await this.http.get(`/gamecenter/${gameId}/boxscore`);

    if (!res.data) {
      throw new InternalServerErrorException(
        `No boxscore data found for game ${gameId}`,
      );
    }

    return res.data;
  }
}
