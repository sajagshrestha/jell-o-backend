import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigModule } from '@app/env-config';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import dbConfig from './configs/db.config';

@Module({
  imports: [EnvConfigModule, TypeOrmModule.forRoot(dbConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
