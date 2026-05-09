import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const id = req.headers["x-request-id"] || randomUUID();
    req.correlationId = id;
    res.setHeader("x-request-id", id);
    next();
  }
}
