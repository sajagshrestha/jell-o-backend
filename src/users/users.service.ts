import {
  HttpException,
  HttpStatus,
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

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
