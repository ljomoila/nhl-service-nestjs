import { Controller, Get } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamDTO } from "./dto/team.dto";
import { ApiInternalServerErrorResponse, ApiOkResponse } from "@nestjs/swagger";
import { CacheTTL } from "@nestjs/cache-manager";

@Controller("teams")
@CacheTTL(3600) // Cache for 1 hour
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Get()
  @ApiOkResponse({
    description: "List of all teams",
    type: [TeamDTO],
  })
  @ApiInternalServerErrorResponse()
  async findAll(): Promise<TeamDTO[]> {
    return await this.service.findAll();
  }
}
