import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle("NHL API")
    .setDescription("Lorem ipsum")
    .setVersion("1.0")

    // 🔐 Add API Key auth
    .addApiKey(
      {
        type: "apiKey",
        name: "X-API-Key",
        in: "header",
      },
      "api-key", // this is the security name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  document.security = [{ "api-key": [] }];

  SwaggerModule.setup("docs", app, document);
}
