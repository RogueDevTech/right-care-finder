import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific configuration
  app.enableCors({
    origin: "*", // Allow any origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Favina Store API")
    .setDescription("The Favina Store API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup("api", app as any, document);

  await app.listen(process.env.PORT || 4001, () => {
    console.log(
      `---------Server is running on port ${process.env.PORT || 4001}👍👍👍 ---------`,
    );
    console.log(
      `Swagger documentation available at http://localhost:${process.env.PORT || 4001}/api`,
    );
  });
}
bootstrap();
