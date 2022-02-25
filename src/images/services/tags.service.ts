import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Like } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';
import { ImagesService } from './images.service';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    @Inject(forwardRef(() => ImagesService))
    private readonly imageService: ImagesService,
  ) {}

  async create(name: string) {
    return await this.tagRepository.save({ name });
  }

  async findOne(name: string): Promise<Tag | null> {
    const tag = await this.tagRepository.findOne({ name });

    return tag ?? null;
  }

  async find(name: string): Promise<Tag[]> {
    if (name !== undefined) {
      const tags = await this.tagRepository.find({
        take: 10,
        where: { name: Like(`%${name}%`) },
      });

      return tags;
    }

    return [];
  }

  async popular() {
    const rawTags = await this.imageService.getPopularTags();

    const tags: Tag[] = rawTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      imageCount: tag.count,
    }));

    return tags;
  }

  async images(id: number, user: User) {
    const images = await this.imageService.getImagesByTag(id, user);

    return images;
  }
}
