import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  followerCount?: number;

  followingCount?: number;

  isFollowing?: boolean;
}
