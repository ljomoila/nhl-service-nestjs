import { Controller, Get } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamDTO } from "./dto/team.dto";
import { ApiInternalServerErrorResponse, ApiOkResponse } from "@nestjs/swagger";

@Controller("teams")
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
