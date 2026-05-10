import { Controller, Get, Param } from "@nestjs/common";
import { PlayersService } from "./players.service";
import { PlayerDTO, PlayerWithSeasonStatsDTO } from "./dto/player.dto";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CacheTTL } from "@nestjs/cache-manager";

@Controller("players")
@CacheTTL(3600) // Cache for 1 hour
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOkResponse({
    description: "List of all players",
    type: [PlayerDTO],
  })
  @ApiInternalServerErrorResponse()
  async getPlayers(): Promise<PlayerDTO[]> {
    return await this.playersService.getPlayers();
  }

  @Get(":playerId")
  @ApiOkResponse({
    description: "Details of a specific player",
    type: PlayerDTO,
  })
  @ApiNotFoundResponse({ description: "Player not found" })
  @ApiInternalServerErrorResponse()
  async getPlayer(
    @Param("playerId") playerId: string,
  ): Promise<PlayerDTO | null> {
    return await this.playersService.getPlayer(Number(playerId));
  }

  @Get(":playerId/currentSeason/stats")
  @ApiOkResponse({
    description: "Current season stats of a specific player",
    type: PlayerWithSeasonStatsDTO,
  })
  @ApiNotFoundResponse({
    description: "No stats found for the specified player",
  })
  @ApiInternalServerErrorResponse()
  async getCurrentSeasonStats(
    @Param("playerId") playerId: string,
  ): Promise<PlayerWithSeasonStatsDTO> {
    return await this.playersService.getCurrentSeasonStats(Number(playerId));
  }
}
