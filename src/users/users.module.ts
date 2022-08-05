import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';
import { UsersService } from 'src/users/users.service';
import { Follow } from './entities/follow.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ImagesModule),
    TypeOrmModule.forFeature([UserRepository, Follow]),
    NotificationModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
