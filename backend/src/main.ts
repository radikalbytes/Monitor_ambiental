import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  app.enableCors({
    origin: '*',
  });
  app.use(json({ limit: '50mb' }));
  
  /*
    Swagger set up
  */
  const config = new DocumentBuilder()
  .setTitle('WebPi Solutions Digital Services')
  .setDescription('API de la plataforma de gestión de datos del hogar desarrollada por WebPi Solutions Digital Services y RadikalBytes')
  .setVersion('1.0')
  // .addBearerAuth(
  //   {
  //     type: 'http',
  //     scheme: 'bearer',
  //     bearerFormat: 'JWT',
  //   },
  //   'auth_token',
  // )
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
