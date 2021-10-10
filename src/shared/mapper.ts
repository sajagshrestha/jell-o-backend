import { CommentDto } from 'src/comment/dto/commentDto';
import { Comment } from 'src/comment/entities/comment.entity';
import { ImageDto } from 'src/images/dto/image.dto';
import { Image } from 'src/images/entities/image.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

export const toUserDto = (data: User): UserDto => {
  const { id, username } = data;
  const userDto: UserDto = { id, username };

  return userDto;
};

export const toImageDto = (data: Image) => {
  const { id, title, url, uploader, tags } = data;

  const imageDto: ImageDto = {
    id,
    title,
    url,
    uploader: toUserDto(uploader),
    tags,
  };

  return imageDto;
};

export const toCommentDto = (data: Comment) => {
  const { id, body, author, parent, replies, image } = data;

  const commentDto: CommentDto = {
    id,
    body,
    author: toUserDto(author),
    parentId: parent ? parent.id : null,
    replies: replies ? replies.map((reply) => toCommentDto(reply)) : null,
    imageId: image.id,
  };

  return commentDto;
};
