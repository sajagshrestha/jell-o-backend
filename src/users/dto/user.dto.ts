import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  followerCount?: number;

  @ApiProperty()
  followingCount?: number;

  @ApiProperty()
  isFollowing?: boolean;

  @ApiProperty()
  postCount?: number;
}
