import { DateTime } from 'luxon';
import { Query } from 'mysql2';
import { EntityRepository, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  getPopular() {
    return this.createQueryBuilder('image')
      .where('image.created_at > :date', {
        date: DateTime.now().minus({ months: 1 }).toISODate(),
      })
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(L.id)', 'count')
            .from('like', 'L')
            .where('L.image.id = image.id'),
        'likesCount',
      )
      .leftJoinAndSelect('image.uploader', 'up loader')
      .leftJoinAndSelect('image.tags', 'tags')
      .loadRelationCountAndMap('image.likes_count', 'image.likes')
      .orderBy('likesCount', 'DESC')
      .take(20)
      .getMany();
  }
}
