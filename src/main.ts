import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const port = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === '1';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  const config = new DocumentBuilder()
    .setTitle('Tabebena API')
    .setDescription('The Tabebena API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  if (!isVercel) {
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Application is running on: http://localhost:${port}`);
    // eslint-disable-next-line no-console
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  }

  return app;
}

if (!isVercel) {
  bootstrap();
}

// Vercel serverless entry point
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const server = (app.getHttpAdapter() as any).getInstance();
  return server(req, res);
}
