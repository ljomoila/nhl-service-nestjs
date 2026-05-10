// src/common/guards/api-key.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers["x-api-key"];
    const validApiKey = process.env.API_KEY;

    if (!validApiKey) {
      throw new Error("API_KEY not set in environment");
    }

    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException("Invalid API key");
    }

    return true;
  }
}
