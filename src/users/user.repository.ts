import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  search(query: string, user: User, take = 10) {
    return this.createQueryBuilder('user')
      .loadRelationCountAndMap('user.followerCount', 'user.followers')
      .loadRelationCountAndMap('user.followingCount', 'user.following')
      .loadRelationCountAndMap('user.postCount', 'user.images')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(F.id)', 'count')
            .from('follow', 'F')
            .where('F.follower.id = :authUserId', { authUserId: user.id })
            .andWhere('F.following.id = user.id'),
        'user_isFollowing',
      )
      .where('user.id != :authUserId', { authUserId: user.id })
      .andWhere('username LIKE :query', { query: `%${query}%` })
      .take(take)
      .getMany();
  }
}
