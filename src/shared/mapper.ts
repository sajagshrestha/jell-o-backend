import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

export const toUserDto = (data: User): UserDto => {
  const { id, username, email } = data;
  const userDto: UserDto = { id, username, email };
  return userDto;
};
