import { Module, MiddlewareConsumer } from "@nestjs/common";
import { LoggerModule } from "./modules/logger/logger.module";
import { RequestContextMiddleware } from "./common/middlewares/request-context.middleware";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { validate } from "./config/validate";
import { NhlModule } from "./modules/integrations/nhl.module";
import { TeamsModule } from "./modules/teams/teams.module";
import { PrismaModule } from "./prisma/prisma.module";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";
import { SyncModule } from "./modules/sync/sync.module";
import { PlayersModule } from "./modules/players/players.module";
import { ScheduleModule } from "@nestjs/schedule";
import { GamesModule } from "./modules/games/games.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.get("REDIS_HOST", "localhost"),
            port: config.get("REDIS_PORT", 6379),
          },
        }),
        ttl: config.get<number>("CACHE_TTL_SECONDS") ?? 60,
      }),
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    PrismaModule,
    NhlModule,
    TeamsModule,
    SyncModule,
    PlayersModule,
    GamesModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
