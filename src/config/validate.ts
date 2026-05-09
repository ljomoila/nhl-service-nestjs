import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { AppConfig } from "./app.config";

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .join("; "),
    );
  }

  return validatedConfig;
}
