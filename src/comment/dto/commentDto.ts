import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class CommentDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  author: UserDto;

  @IsNotEmpty()
  imageId: number;

  parentId?: number;

  replies?: CommentDto[];

  replies_count?: number;
}
