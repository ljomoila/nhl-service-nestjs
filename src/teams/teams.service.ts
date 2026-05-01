import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTeamDto } from "./dto/team.dto";

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.team.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
