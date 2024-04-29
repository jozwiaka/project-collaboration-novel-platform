import { NestFactory } from '@nestjs/core';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const corsOptions: CorsOptions = {
  //   origin: ['http://localhost:4200'], // Replace with your Angular app's URL
  //   credentials: true, // Allow credentials such as cookies, authorization headers with HTTPS
  // };
  // app.enableCors(corsOptions);

  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(3000);
}
bootstrap();
