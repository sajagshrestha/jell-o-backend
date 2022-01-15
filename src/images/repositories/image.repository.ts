import { DateTime } from 'luxon';
import { Query } from 'mysql2';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Image } from '../entities/image.entity';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  baseQueryBuilder(user: User, loadTags = true) {
    const query = this.createQueryBuilder('image')
      .leftJoinAndSelect('image.uploader', 'uploader')
      .loadRelationCountAndMap('image.likeCount', 'image.likes')
      .loadRelationCountAndMap('image.commentCount', 'image.comments')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(L.id)', 'count')
            .from('like', 'L')
            .where('L.user.id = :userId', { userId: user.id })
            .andWhere('L.image.id = image.id'),
        'image_isLiked',
      )
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(S.id)', 'count')
            .from('saved_image', 'S')
            .where('S.user.id = :userId', { userId: user.id })
            .andWhere('S.image.id = image.id'),
        'image_isSaved',
      );

    if (loadTags) {
      query.leftJoinAndSelect('image.tags', 'tags');
    }

    return query;
  }

  getOneWithDetail(id: number, user: User) {
    return this.baseQueryBuilder(user)
      .where('image.id = :id', { id })
      .leftJoinAndSelect('image.comments', 'comments')
      .getOne();
  }

  getFeed(user: User, followerIds: number[]) {
    return this.baseQueryBuilder(user)
      .where('image.uploader.id IN (:...followerIds)', { followerIds })
      .orderBy('updated_at', 'DESC')
      .getMany();
  }

  getPopular(user: User) {
    return this.baseQueryBuilder(user)
      .where('image.created_at > :date', {
        date: DateTime.now().minus({ months: 1 }).toISODate(),
      })
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(L.id)', 'count')
            .from('like', 'L')
            .where('L.image.id = image.id'),
        'likeCount',
      )
      .orderBy('likeCount', 'DESC')
      .take(20)
      .getMany();
  }

  getSimilar(id: number, user: User, tagIds: number[]) {
    return this.baseQueryBuilder(user, false)
      .innerJoinAndSelect('image.tags', 'tags', 'tags.id IN (:...tagIds)', {
        tagIds,
      })
      .where('image.id != :id', { id })
      .getMany();
  }
}
