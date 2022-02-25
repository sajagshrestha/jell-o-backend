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
            .where('L.user.id = :authUserId', { authUserId: user.id })
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
      .orderBy('image.updated_at', 'DESC')
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

  getUserImages(user: User, authUser: User) {
    return this.baseQueryBuilder(authUser)
      .where('image.uploader.id = :userId', {
        userId: user.id,
      })
      .getMany();
  }

  getManyWithDetail(imageIds: number[], user: User) {
    return this.baseQueryBuilder(user)
      .where('image.id IN (:...imageIds)', { imageIds })
      .getMany();
  }

  search(query: string, user: User, take = 10) {
    return this.baseQueryBuilder(user)
      .where('caption LIKE :query', { query: `%${query}%` })
      .take(take)
      .getMany();
  }

  getPopularTags() {
    return this.createQueryBuilder('image')
      .where('image.created_at > :created_at', {
        created_at: DateTime.now().minus({ weeks: 1 }).toISODate(), // make sure you set your own date here
      })
      .leftJoinAndSelect('image.tags', 'tag')
      .groupBy('tag.id') // here is where we grup by the tag so we can count
      .addGroupBy('tag.id')
      .select('tag.id, tag.name, count(tag.id) as count') // here is where we count :)
      .orderBy('count(tag.id)', 'DESC')
      .take(10) // here is the limit
      .getRawMany();
  }

  getImagesByTag(tagId: number, user: User) {
    return this.baseQueryBuilder(user)
      .innerJoinAndSelect('image.tags', 'tag', 'tag.id = :tagId', { tagId })
      .orderBy('image.created_at', 'DESC')
      .take(20)
      .getMany();
  }
}
