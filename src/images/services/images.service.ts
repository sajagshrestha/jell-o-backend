import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { CommentService } from 'src/comment/comment.service';
import { UserDto } from 'src/users/dto/user.dto';
import { Follow } from 'src/users/entities/follow.entity';
import { UsersService } from 'src/users/users.service';
import { In, MoreThan, Repository } from 'typeorm';
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
    private readonly tagService: TagService,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(SavedImage)
    private readonly savedImageRepository: Repository<SavedImage>,
  ) {}

  async create(
    { username }: UserDto,
    createImageDto: CreateImageDto,
  ): Promise<Image> {
    const uploader = await this.userService.findByUsername(username);

    const tags = await Promise.all(
      createImageDto.tags.map((name) => this.preloadTagsByName(name)),
    );

    const image = this.imageRepository.create({
      ...createImageDto,
      tags,
      uploader,
    });

    await this.imageRepository.save(image);

    return image;
  }

  async getFeedImages(following: Follow[]): Promise<Image[]> {
    const images = await this.imageRepository.find({
      where: {
        uploader: In(following.map((follow) => follow.following.id)),
      },
      relations: ['uploader', 'tags'],
      order: {
        updated_at: 'DESC',
      },
    });

    return images;
  }

  async getPopularImages(): Promise<Image[]> {
    // const images = await this.imageRepository.find({
    //   where: {
    //     created_at: MoreThan(DateTime.now().minus({ weeks: 1 }).toString()),
    //   },
    //   relations: ['uploader', 'tags'],
    //   order: {
    //     updated_at: 'DESC',
    //   },
    //   take: 20,
    // });

    const images = await this.imageRepository.getPopular();

    return images;
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({ id });
    image.comments = await this.commentService.findParentComments(id);

    if (!image) {
      throw new NotFoundException('Image does not exists');
    }

    image.likes_count = await this.likesRepository.count({ image });

    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const tags = await Promise.all(
      updateImageDto.tags.map((name) => this.preloadTagsByName(name)),
    );

    const existingImage = await this.imageRepository.preload({
      id: id,
      ...updateImageDto,
      tags: tags,
    });

    if (!existingImage) {
      throw new NotFoundException('Image does not exists');
    }
    await this.imageRepository.save(existingImage);

    return existingImage;
  }

  async remove(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne(id);
    await this.imageRepository.remove(image);

    return image;
  }

  async getSimilarImages(id: number): Promise<Image[]> {
    const image = await this.findOne(id);

    const ids = image.tags.map((t) => t.id);

    const similarImages = this.imageRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.uploader', 'uploader')
      .innerJoinAndSelect('image.tags', 'tags', 'tags.id IN (:...ids)', { ids })
      .where('image.id != :id', { id })
      .getMany();

    return similarImages;
  }

  async addSavedImage(id: number, { username }: UserDto): Promise<SavedImage> {
    const image = await this.imageRepository.findOne(id);
    const user = await this.userService.findByUsername(username);

    const savedImage = await this.savedImageRepository.save({
      user,
      image,
    });

    return savedImage;
  }

  async getSavedImages(username: string) {
    const user = await this.userService.findByUsername(username);
    const savedImages = await this.savedImageRepository.find({
      user: user,
    });

    return savedImages;
  }

  async addLikes(id: number, { username }: UserDto) {
    const image = await this.imageRepository.findOne(id);
    const user = await this.userService.findByUsername(username);

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

    await this.likesRepository.save({
      image,
      user,
    });

    return;
  }

  private async preloadTagsByName(name: string) {
    const existingTag = await this.tagService.findOne(name);

    if (existingTag) {
      return existingTag;
    }

    return this.tagService.create(name);
  }
}
