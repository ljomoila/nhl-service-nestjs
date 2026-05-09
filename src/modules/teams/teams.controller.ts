import { Controller, Get } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamDTO } from "./dto/team.dto";

@Controller("teams")
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Get()
  async findAll(): Promise<TeamDTO[]> {
    return await this.service.findAll();
  }
}
