import { IsNotEmpty } from 'class-validator';
import { CommentDto } from 'src/comment/dto/commentDto';
import { UserDto } from 'src/users/dto/user.dto';
import { Tag } from '../entities/tag.entity';

export class ImageDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  url: string;

  uploader: UserDto;

  tags?: Tag[];

  comments?: CommentDto[];

  likes_count?: number;

  created_at: Date;
}
