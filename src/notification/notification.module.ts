import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationController } from './notification.controller';
import { NotificationListener } from './notification.listener';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationListener],
  exports: [NotificationService],
})
export class NotificationModule {}
