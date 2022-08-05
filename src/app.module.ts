import { EnvConfigModule } from '@app/env-config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { CommentModule } from './comment/comment.module';
import { ImagesModule } from './images/images.module';
import { NotificationModule } from './notification/notification.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';

import { EventEmitterModule } from '@nestjs/event-emitter';
import dbConfig from './configs/db.config';

@Module({
  imports: [
    EnvConfigModule,
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    UsersModule,
    ImagesModule,
    CommentModule,
    CaslModule,
    SearchModule,
    NotificationModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
  ],
})
export class AppModule {}
