import { forwardRef, Inject, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { ImagesModule } from 'src/images/images.module';
import { CaslModule } from 'src/casl/casl.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    CaslModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ImagesModule),
    TypeOrmModule.forFeature([CommentRepository]),
    NotificationModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
