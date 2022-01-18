import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  search(query: string, take = 10) {
    return this.createQueryBuilder('user')
      .loadRelationCountAndMap('user.followerCount', 'user.followers')
      .loadRelationCountAndMap('user.followingCount', 'user.following')
      .where('username LIKE :query', { query: `%${query}%` })
      .take(take)
      .getMany();
  }
}
