 // src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin/admin.entity';

@Module({
  imports: [AdminModule,TypeOrmModule
    .forRoot({
      type: 'postgres', // or 'mysql', 'sqlite', etc.
      host: 'localhost',
      port: 5432, // default port for PostgreSQL
      username: 'postgres', // your database username
      password: 'root', // your database password
      database: 'admin_user',
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Set to false in production
    }),
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}