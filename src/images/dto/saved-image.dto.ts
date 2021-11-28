import { UserDto } from 'src/users/dto/user.dto';
import { ImageDto } from './image.dto';

export class SavedImageDto {
  id: number;
  image: ImageDto;
}
