 // src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin/admin.entity';

@Module({
   imports: [AdminModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'dpg-d25r49a4d50c73fjma40-a.singapore-postgres.render.com',
      port: 5432,
      username: 'office_management_taln_user',
      password: 'jHyLtss6t2w1s0DWYwMYn25tnmoT0GE2',
      database: 'office_management_taln',
      autoLoadEntities: true,
      synchronize: true,
      extra : {
        ssl: {
          rejectUnauthorized: false,
        }
      }
      } ),
      TypeOrmModule.forFeature([ AdminEntity ]), 
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}