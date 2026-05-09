import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TeamDTO } from "./dto/team.dto";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(): Promise<TeamDTO[]> {
    // Try cache
    // const cached = await this.cache.get<TeamDTO[]>(CacheKeys.teamsAll);
    // if (cached) {
    //   return cached;
    // }

    // Fetch from DB
    const teams = await this.prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        shortName: true,
        abbreviation: true,
        createdAt: true,

        players: {
          select: {
            id: true,
            nhlId: true,
            fullName: true,
            firstName: true,
            lastName: true,
            nationality: true,
            playerType: true,
          },
        },
      },
    });

    // Store in cache
    // await this.cache.set(CacheKeys.teamsAll, teams);

    return teams;
  }
}
