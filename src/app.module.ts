import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigModule } from '@app/env-config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { CommentModule } from './comment/comment.module';

import dbConfig from './configs/db.config';

@Module({
  imports: [
    EnvConfigModule,
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    UsersModule,
    ImagesModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
