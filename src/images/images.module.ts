import { forwardRef, Inject, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageRepository } from './image.repository';
import { Tag } from './entities/tag.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommentModule } from 'src/comment/comment.module';
import { SavedImage } from './entities/savedImages.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([ImageRepository, Tag, SavedImage]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
