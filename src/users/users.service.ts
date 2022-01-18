import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { ImagesService } from 'src/images/services/images.service';
import { UserDto } from './dto/user.dto';
import { SavedImage } from 'src/images/entities/savedImages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageRepository } from 'src/images/repositories/image.repository';
import { Follow } from './entities/follow.entity';
import { toImageDto } from 'src/shared/mapper';
import { Image } from 'src/images/entities/image.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => ImagesService))
    private readonly imageService: ImagesService,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;

    const userWithSameUsername = await this.userRepository.findOne({
      username,
    });
    const userWithSameEmail = await this.userRepository.findOne({ email });

    if (userWithSameUsername) {
      throw new HttpException(
        'Username is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userWithSameEmail) {
      throw new HttpException('Email is already taken', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ username });

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async validateUserLogin({ username, password }: UserLoginDto): Promise<User> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async getUserImages(user: User) {
    const images = await user.images;

    return images;
  }

  async getUserSavedImages(user: User) {
    const savedImages = await this.imageService.getSavedImages(user);

    return savedImages;
  }

  async followUser(user: User, following: User) {
    await this.followRepository.save({
      follower: user,
      following: following,
    });
  }

  async unFollowUser(user: User, following: User) {
    await this.followRepository.delete({
      follower: user,
      following: following,
    });
  }

  async getFollowersAndFollowing(user: User) {
    const followerCount = await this.followRepository.count({
      where: {
        following: user,
      },
    });
    const followingCount = await this.followRepository.count({
      where: {
        follower: user,
      },
    });

    return {
      followerCount,
      followingCount,
    };
  }

  async getUserFeeds(user: User) {
    const following: Follow[] = await this.followRepository.find({
      where: { follower: user },
      relations: ['following'],
    });

    const images = await this.imageService.getFeedImages(user, following);

    return images;
  }

  async isFollowing(user: User, follower: User): Promise<boolean> {
    const count = await this.followRepository.count({
      where: {
        following: user,
        follower: follower,
      },
    });

    return count > 0;
  }

  async profile(user: User, currentUser: User) {
    const images = await this.imageService.getUserImage(user, currentUser);
    const { followerCount, followingCount } =
      await this.getFollowersAndFollowing(user);
    user.followerCount = followerCount;
    user.followingCount = followingCount;
    user.isFollowing = await this.isFollowing(user, currentUser);

    return { userProfile: user, images };
  }

  async search(query: string) {
    return this.userRepository.search(query);
  }
}
