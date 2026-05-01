import { Body, Controller, Get, Post } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/team.dto";

@Controller("teams")
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
