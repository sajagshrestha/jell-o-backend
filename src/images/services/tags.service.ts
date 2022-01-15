import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

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
}
