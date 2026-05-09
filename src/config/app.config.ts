import { IsString, IsUrl, IsOptional, IsNumber, Min } from "class-validator";

export type Environment = "development" | "test" | "production";

export class AppConfig {
  @IsString()
  NODE_ENV: Environment = "development";

  @IsString()
  DATABASE_URL: string;

  @IsUrl()
  @IsOptional()
  NHL_API_BASE_URL: string = "https://api-web.nhle.com/v1";

  @IsNumber()
  @Min(1)
  @IsOptional()
  CACHE_TTL_SECONDS: number = 1440; // 1 day in seconds

  @IsNumber()
  @Min(1)
  @IsOptional()
  CACHE_MAX_ITEMS: number = 100;
}
