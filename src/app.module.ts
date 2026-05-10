import { Module, MiddlewareConsumer } from "@nestjs/common";
import { LoggerModule } from "./modules/logger/logger.module";
import { RequestContextMiddleware } from "./common/middlewares/request-context.middleware";
import { ConfigModule } from "@nestjs/config";
import { validate } from "./config/validate";
import { NhlModule } from "./modules/integrations/nhl.module";
import { TeamsModule } from "./modules/teams/teams.module";
import { PrismaModule } from "./prisma/prisma.module";
import { CacheModule } from "@nestjs/cache-manager";
import { SyncModule } from "./modules/sync/sync.module";
import { PlayersModule } from "./modules/players/players.module";
import { ScheduleModule } from "@nestjs/schedule";
import { GamesModule } from "./modules/games/games.module";
import { CacheInterceptor } from "./cache/cache.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    CacheModule.register(),
    ScheduleModule.forRoot(),
    LoggerModule,
    PrismaModule,
    NhlModule,
    TeamsModule,
    SyncModule,
    PlayersModule,
    GamesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
