import { Controller, Get, Param } from "@nestjs/common";

import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { GamesService } from "./games.service";
import { GameBoxscoreDTO } from "./dto/games.dto";
import { CacheTTL } from "@nestjs/cache-manager";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(":date")
  @ApiOkResponse({
    description: "List of games for the specified date",
    type: [GameBoxscoreDTO],
  })
  @ApiNotFoundResponse({ description: "No games found for the specified date" })
  @ApiInternalServerErrorResponse()
  @CacheTTL(60) // Cache the response for 1 minute
  async getGamesByDate(
    @Param("date") date: string,
  ): Promise<GameBoxscoreDTO[]> {
    return await this.gamesService.getGamesByDate(date);
  }
}
