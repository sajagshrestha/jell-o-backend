import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { NotificationType } from 'src/notification/notification.entity';
import { NotificationEvent } from 'src/notification/notification.event';
import { Follow } from 'src/users/entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateImageDto } from '../dto/create-image.dto';
import { UpdateImageDto } from '../dto/update-image.dto';
import { Image } from '../entities/image.entity';
import { Like } from '../entities/like.entity';
import { SavedImage } from '../entities/savedImages.entity';
import { ImageRepository } from '../repositories/image.repository';
import { TagService } from './tags.service';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly imageRepository: ImageRepository,
    private readonly commentService: CommentService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(SavedImage)
    private readonly savedImageRepository: Repository<SavedImage>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({ id });

    if (!image) {
      throw new NotFoundException('Image does not exists');
    }

    return image;
  }

  async fetchWithDetail(id: number, user: User): Promise<Image> {
    const image = await this.imageRepository.getOneWithDetail(id, user);

    if (!image) {
      throw new NotFoundException('Image does not exists');
    }

    image.comments = await this.commentService.findParentComments(image.id);

    return image;
  }

  async create(uploader: User, createImageDto: CreateImageDto): Promise<Image> {
    const tags = await Promise.all(
      createImageDto.tags.map((name) => this.preloadTagsByName(name)),
    );

    const image = this.imageRepository.create({
      ...createImageDto,
      tags,
      uploader: uploader,
    });

    await this.imageRepository.save(image);

    return await this.fetchWithDetail(image.id, uploader);
  }

  async getFeedImages(user: User, following: Follow[]) {
    const followingIds = following.map((follow) => follow.following.id);
    const images = await this.imageRepository.getFeed(user, followingIds);

    return images;
  }

  async getPopularImages(user: User) {
    const images = await this.imageRepository.getPopular(user);

    return images;
  }

  async getSimilarImages(id: number, user: User): Promise<Image[]> {
    const image = await this.findOne(id);

    const tagIds = image.tags.map((t) => t.id);

    const similarImages = this.imageRepository.getSimilar(id, user, tagIds);

    return similarImages;
  }

  async getUserImage(user: User, authUser: User) {
    return await this.imageRepository.getUserImages(user, authUser);
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const tags = await Promise.all(
      updateImageDto.tags.map((name) => this.preloadTagsByName(name)),
    );

    await this.imageRepository.update(id, {
      caption: updateImageDto.caption,
      url: updateImageDto.url,
      thumbnailUrl: updateImageDto.thumbnailUrl,
    });

    const image = await this.imageRepository.findOne(id);
    image.tags = tags;

    await this.imageRepository.save(image);

    if (!image) {
      throw new NotFoundException('Image does not exists');
    }
    await this.imageRepository.save(image);

    return image;
  }

  async remove(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne(id);
    await this.imageRepository.remove(image);

    return image;
  }

  async addSavedImage(id: number, user: User): Promise<SavedImage> {
    const image = await this.imageRepository.findOne(id);
    const savedImage = await this.savedImageRepository.save({
      user,
      image,
    });

    return savedImage;
  }

  async removeSavedImage(id: number, user: User) {
    const image = await this.findOne(id);

    return await this.savedImageRepository.delete({
      user,
      image,
    });
  }

  async getSavedImages(user: User) {
    const savedImages = await this.savedImageRepository.find({
      user: user,
    });

    if (savedImages.length === 0) {
      return [];
    }

    const savedImagesIds = savedImages.map((savedImage) => savedImage.image.id);

    const images = await this.imageRepository.getManyWithDetail(
      savedImagesIds,
      user,
    );

    return images;
  }

  async addLikes(id: number, user: User) {
    const image = await this.imageRepository.findOne(id);

    if (
      (await this.likesRepository.count({
        image,
        user,
      })) > 0
    ) {
      await this.likesRepository.softDelete({
        image,
        user,
      });

      return;
    }

    if (
      (await this.likesRepository
        .createQueryBuilder('like')
        .where('like.imageId = :imageId', { imageId: id })
        .andWhere('like.userId = :userId', { userId: user.id })
        .withDeleted()
        .getCount()) > 0
    ) {
      await this.likesRepository.restore({
        image,
        user,
      });

      return;
    }

    this.eventEmitter.emit('image.like', new NotificationEvent(NotificationType.LIKE, image.uploader, user, image ));
    
    await this.likesRepository.save({
      image,
      user,
    });

    return;
  }

  async search(query: string, user: User) {
    return this.imageRepository.search(query, user);
  }

  async getPopularTags() {
    return await this.imageRepository.getPopularTags();
  }

  async getImagesByTag(tagId: number, user: User) {
    return await this.imageRepository.getImagesByTag(tagId, user);
  }

  private async preloadTagsByName(name: string) {
    const existingTag = await this.tagService.findOne(name);

    if (existingTag) {
      return existingTag;
    }

    return this.tagService.create(name);
  }
}
