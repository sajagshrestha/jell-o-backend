import { forwardRef, Inject, Module } from '@nestjs/common';
import { ImagesService } from './services/images.service';
import { ImagesController } from './controllers/images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageRepository } from './repositories/image.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommentModule } from 'src/comment/comment.module';
import { SavedImage } from './entities/savedImages.entity';
import { Like } from './entities/like.entity';
import { CaslModule } from 'src/casl/casl.module';
import { TagRepository } from './repositories/tag.repository';
import { TagService } from './services/tags.service';
import { TagsController } from './controllers/tags.controller';

@Module({
  imports: [
    CaslModule,
    forwardRef(() => AuthModule),
    forwardRef(() => CommentModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([
      ImageRepository,
      TagRepository,
      SavedImage,
      Like,
    ]),
  ],
  controllers: [ImagesController, TagsController],
  providers: [ImagesService, TagService],
  exports: [ImagesService],
})
export class ImagesModule {}
