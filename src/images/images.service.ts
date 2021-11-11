import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { toImageDto } from 'src/shared/mapper';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDto } from './dto/image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';
import { Tag } from './entities/tag.entity';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImagesService {
  constructor(
    private readonly imageRepository: ImageRepository,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly userService: UsersService,

    private readonly commentService: CommentService,
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

  async findAll(): Promise<Image[]> {
    const images = await this.imageRepository.find();

    return images;
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({ id });
    image.comments = await this.commentService.findParentComments(id);

    if (!image) {
      throw new NotFoundException('Image does not exists');
    }

    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const tags =
      updateImageDto.tags &&
      (await Promise.all(
        updateImageDto.tags.map((name) => this.preloadTagsByName(name)),
      ));

    const existingImage = await this.imageRepository.preload({
      id: id,
      ...updateImageDto,
      tags,
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
      .getMany();

    return similarImages;
  }

  async getUserImages() {
    return;
  }

  private async preloadTagsByName(name: string) {
    const existingTag = await this.tagRepository.findOne({ name });

    if (existingTag) {
      return existingTag;
    }

    return this.tagRepository.create({ name });
  }
}
