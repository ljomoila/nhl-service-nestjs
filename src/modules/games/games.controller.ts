import { Controller, Get, Param } from "@nestjs/common";

import { ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { GamesService } from "./games.service";
import { GameBoxscoreDTO } from "./dto/games";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(":date")
  @ApiOkResponse({
    description: "List of games for the specified date",
    type: [GameBoxscoreDTO],
  })
  @ApiNotFoundResponse({ description: "No games found for the specified date" })
  async getGamesByDate(
    @Param("date") date: string,
  ): Promise<GameBoxscoreDTO[]> {
    return await this.gamesService.getGamesByDate(date);
  }
}
