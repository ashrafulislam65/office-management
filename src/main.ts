// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 9001);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   // Enable CORS if needed (adjust settings as required)
//   app.enableCors({
//     origin: true, // or specify your frontend URL
//     credentials: true, // important for sessions
//   });

//   // Session middleware configuration
//   app.use(
//     session({
//       secret: 'secret_weapon', // Replace with a strong secret
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         maxAge: 24 * 60 * 60 * 1000, // 24 hours
//         secure: process.env.NODE_ENV === 'production', // HTTPS in production
//         httpOnly: true, // Prevents client-side JS from reading the cookie
//         sameSite: 'lax', // CSRF protection
//       },
//     })
//   );

//   // Initialize passport
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // Global validation pipe
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//     transform: true,
//   }));

//   await app.listen(process.env.PORT ?? 9001);
// }
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized:false,
      cookie: {
        secure: false, 
      }
    }),
  );
  app.enableCors();
  
  
  await app.listen(9001);
}
bootstrap();