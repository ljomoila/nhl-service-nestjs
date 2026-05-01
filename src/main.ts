import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { setupSwagger } from "./swagger/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(new AllExceptionsFilter());

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
