import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PlayerType, Team } from "@prisma/client";
import { NhlService } from "src/modules/integrations/nhl.service";
import { PrismaService } from "src/prisma/prisma.service";

/**
 * SyncService is responsible for synchronizing teams and players data from the NHL API to our local database.
 * It syncs data that is not easily retrievable from the NHL API on a per-game basis, such as team and player information.
 */
@Injectable()
export class SyncService implements OnModuleInit {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly nhlService: NhlService,
  ) {}

  public async onModuleInit() {
    const teams = await this.prisma.team.findMany();

    if (teams.length === 0) {
      this.logger.log("No teams found in database, performing initial sync...");
      await this.syncRosters();
    }
  }

  /**
   * Cron job to sync teams and players from the NHL API every day at midnight.
   * This will ensure that database stays up to date with the latest information from the NHL
   * and allows us to have all the necessary data for our application without having to make multiple API calls on a per-game basis.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncRosters(): Promise<void> {
    const startTime = new Date();
    try {
      this.logger.log("Starting rosters sync...");
      await this.doRostersSync();
    } catch (error) {
      this.logger.error({ message: "Error syncing rosters:", error });
    } finally {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      this.logger.log(`Rosters sync completed in ${duration}ms`);
    }
  }

  private async doRostersSync() {
    const teams = await this.nhlService.getTeams();
    const prismaTeams: Team[] = [];
    let teamsSynced = 0;
    let playersSynced = 0;

    for (const team of teams) {
      // this.logger.log(`Processing team: ${JSON.stringify(team)}`);

      prismaTeams.push(
        await this.prisma.team.upsert({
          where: { abbreviation: team.teamAbbrev["default"] },
          update: {
            name: team.teamName["default"],
            shortName: team.teamCommonName["default"],
          },
          create: {
            name: team.teamName["default"],
            shortName: team.teamCommonName["default"],
            abbreviation: team.teamAbbrev["default"],
          },
        }),
      );
      teamsSynced++;
    }

    for (const team of prismaTeams) {
      const { forwards, defensemen, goalies } = await this.nhlService.getRoster(
        team.abbreviation,
      );

      for (const player of [...forwards, ...defensemen, ...goalies]) {
        // this.logger.log(`Processing player: ${JSON.stringify(player)}`);

        const firstName = player.firstName["default"];
        const lastName = player.lastName["default"];
        const playerType =
          player.positionCode !== "G" ? PlayerType.Skater : PlayerType.Goalie;

        await this.prisma.player.upsert({
          where: { nhlId: player.id },
          update: {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            nationality: player.birthCountry,
            playerType,
            teamId: team.abbreviation,
          },
          create: {
            nhlId: player.id,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            nationality: player.birthCountry,
            playerType,
            teamId: team.abbreviation,
          },
        });
        playersSynced++;
      }
    }

    this.logger.log(
      `Teams synced: ${teamsSynced}, Players synced: ${playersSynced}`,
    );
  }
}
