import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle("NHL API")
    .setDescription("Lorem ipsum")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
}
