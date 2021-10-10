import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toImageDto } from 'src/shared/mapper';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
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
  ) {}

  async create(
    { username }: UserDto,
    createImageDto: CreateImageDto,
  ): Promise<ImageDto> {
    const uploader = await this.userService.findByUsername(username, false);

    const tags = await Promise.all(
      createImageDto.tags.map((name) => this.preloadTagsByName(name)),
    );
    const image = this.imageRepository.create({
      ...createImageDto,
      tags,
      uploader,
    });
    await this.imageRepository.save(image);

    return toImageDto(image);
  }

  async findAll(): Promise<ImageDto[]> {
    const images = await this.imageRepository.find();

    return images.map((image) => toImageDto(image));
  }

  async findOne(id: number, transform = true): Promise<ImageDto | Image> {
    const image = await this.imageRepository.findOne(
      { id },
      { relations: ['comments'] },
    );

    if (!image) {
      throw new NotFoundException('Image does not exists');
    }

    if (transform) {
      return toImageDto(image);
    }

    return image;
  }

  async update(
    id: number,
    updateImageDto: UpdateImageDto,
  ): Promise<ImageDto | Image> {
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

    return this.findOne(id);
  }

  async remove(id: number): Promise<ImageDto> {
    const image = await this.imageRepository.findOne(id);
    await this.imageRepository.remove(image);

    return toImageDto(image);
  }

  private async preloadTagsByName(name: string) {
    const existingTag = await this.tagRepository.findOne({ name });

    if (existingTag) {
      return existingTag;
    }

    return this.tagRepository.create({ name });
  }
}
