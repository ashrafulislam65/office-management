import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with credentials for session cookies
  app.enableCors({
    origin: true, // Set to your frontend URL in production
    credentials: true, // Required for sessions
  });

  // Cookie parser middleware (needed for sessions)
  app.use(cookieParser());

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret-key', // Always use env var in production
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
      },
      rolling: true, // Renew cookie on activity
    }),
  );

  // Global validation pipe (your existing configuration)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();