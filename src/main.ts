import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 整合验证管道（还有很多安装全局管道的方法）
  // whitelist可以避免用户将无用参数传给我们(接口返回成功，但是入参DTO里没有多余的参数)
  // forbidNonWhitelisted 当传递多余的参数时，接口直接返回400 properties should not exist
  // ValidationPipe可以将我们的对象转为实例,
  // 也能将网络中传输过来的字符串（url默认传字符串）转为基本类型（比如number）类型
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        // 自动将uri中传递过来的入参转成定义的type
        enableImplicitConversion: true,
      },
    }),
  );

  // 整合swagger
  const config = new DocumentBuilder()
    .setTitle('My nest example')
    .setDescription('The coffee API desc')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
