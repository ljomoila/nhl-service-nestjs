import { Controller, Get, Param } from "@nestjs/common";
import { PlayersService } from "./players.service";
import { PlayerWithSeasonStatsDTO } from "./dto/player.dto";
import { ApiNotFoundResponse } from "@nestjs/swagger";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get(":playerId/currentSeason/stats")
  @ApiNotFoundResponse()
  async getCurrentSeasonStats(
    @Param("playerId") playerId: string,
  ): Promise<PlayerWithSeasonStatsDTO> {
    return await this.playersService.getCurrentSeasonStats(Number(playerId));
  }
}
