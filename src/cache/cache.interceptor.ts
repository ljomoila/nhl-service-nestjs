import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const key = `http:${req.method}:${req.url}`;

    return from(this.cache.get(key)).pipe(
      switchMap((cached) => {
        if (cached) return from([cached]);

        return next.handle().pipe(
          switchMap(async (data) => {
            await this.cache.set(key, data, 60);
            return data;
          }),
        );
      }),
    );
  }
}
