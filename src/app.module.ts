import { Module, MiddlewareConsumer } from "@nestjs/common";
import { LoggerModule } from "./logger/logger.module";
import { TeamsController } from "./teams/teams.controller";
import { HealthController } from "./health/health.controller";
import { TeamsService } from "./teams/teams.service";
import { PrismaService } from "./prisma/prisma.service";
import { RequestContextMiddleware } from "./middlewares/request-context.middleware";

@Module({
  imports: [LoggerModule],
  controllers: [TeamsController, HealthController],
  providers: [TeamsService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
