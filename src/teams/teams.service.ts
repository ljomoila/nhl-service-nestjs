import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTeamDTO, TeamDTO } from "./dto/team.dto";

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTeamDTO) {
    return this.prisma.team.create({
      data: dto,
    });
  }

  async findAll(): Promise<TeamDTO[]> {
    return this.prisma.team.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
