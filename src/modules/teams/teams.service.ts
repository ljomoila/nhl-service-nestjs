import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TeamDTO } from "./dto/team.dto";

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TeamDTO[]> {
    const teams = await this.prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      include: { players: true },
    });

    return teams;
  }
}
