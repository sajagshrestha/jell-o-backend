import { Injectable } from '@nestjs/common';
import { ImagesService } from 'src/images/services/images.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly userService: UsersService,
    private readonly imageService: ImagesService,
  ) {}

  async search(query: string, user: User) {
    const images = await this.imageService.search(query, user);
    const users = await this.userService.search(query);

    return {
      images,
      users,
    };
  }
}
