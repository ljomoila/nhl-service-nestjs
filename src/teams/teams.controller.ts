import { Body, Controller, Get, Post } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { CreateTeamDTO, TeamDTO } from "./dto/team.dto";

@Controller("teams")
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Post()
  create(@Body() dto: CreateTeamDTO) {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<TeamDTO[]> {
    return await this.service.findAll();
  }
}
