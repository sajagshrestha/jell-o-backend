import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ImagesModule),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
