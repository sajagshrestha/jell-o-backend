import { forwardRef, Inject, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { ImagesModule } from 'src/images/images.module';
import { ImagesService } from 'src/images/images.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    forwardRef(() => ImagesModule),
    TypeOrmModule.forFeature([CommentRepository]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
