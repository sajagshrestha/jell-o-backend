import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/registration-status.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'User registered successfully',
      username: '',
    };

    try {
      const createdUser = await this.userService.create(createUserDto);
      const token = this._createToken(createdUser);

      status = {
        ...status,
        id: createdUser.id,
        username: createUserDto.username,
        ...token,
      };
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginStatus> {
    const user = await this.userService.validateUserLogin(userLoginDto);

    const token = this._createToken(user);

    return {
      id: user.id,
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const { username } = payload;
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  private _createToken({ id, username }: UserDto) {
    const user: JwtPayload = { id, username };
    const accessToken = this.jwtService.sign(user);

    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
    };
  }
}
