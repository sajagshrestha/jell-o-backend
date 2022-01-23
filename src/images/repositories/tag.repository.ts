import { DateTime } from 'luxon';
import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { Image } from '../entities/image.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {}
