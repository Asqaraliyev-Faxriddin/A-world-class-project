import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }))

  let config = new DocumentBuilder()
  .setDescription("swaggger auth uchun")
  .setTitle("swagger")
  .setVersion("4.5")
  .build()
  
  let documentFactory = ()=>SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("swagger",app,documentFactory)

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
