import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PlayerType, Team } from "@prisma/client";
import { NhlService } from "src/modules/integrations/nhl.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly nhlService: NhlService,
  ) {
    this.logger.log("SyncService initialized");
  }

  /**
   * Cron job to sync teams and players from the NHL API every day at midnight.
   * This will ensure that our database stays up to date with the latest information from the NHL.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncTeams(): Promise<void> {
    const startTime = new Date();
    try {
      this.logger.log("Starting teams sync...");
      await this.doTeamsSync();
    } catch (error) {
      this.logger.error({ message: "Error syncing teams:", error });
    } finally {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      this.logger.log(`Teams sync completed in ${duration}ms`);
    }
  }

  private async doTeamsSync() {
    const teams = await this.nhlService.getTeams();
    const prismaTeams: Team[] = [];

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
          player in ["goalies"] ? PlayerType.Goalie : PlayerType.Skater;

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
      }
    }
  }
}
