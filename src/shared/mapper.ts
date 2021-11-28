import { CommentDto } from 'src/comment/dto/commentDto';
import { Comment } from 'src/comment/entities/comment.entity';
import { ImageDto } from 'src/images/dto/image.dto';
import { SavedImageDto } from 'src/images/dto/saved-image.dto';
import { Image } from 'src/images/entities/image.entity';
import { SavedImage } from 'src/images/entities/savedImages.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

export const toUserDto = (data: User): UserDto => {
  const { id, username } = data;
  const userDto: UserDto = { id, username };

  return userDto;
};

export const toCommentDto = (data: Comment) => {
  const { id, body, author, parent, replies, image, replies_count } = data;

  const commentDto: CommentDto = {
    id,
    body,
    author: toUserDto(author),
    parentId: parent ? parent.id : null,
    replies: replies ? replies.map((reply) => toCommentDto(reply)) : null,
    imageId: image.id,
    replies_count: replies_count ?? null,
  };

  return commentDto;
};

export const toImageDto = (data: Image) => {
  const { id, title, url, uploader, tags, comments, created_at, likes_count } =
    data;

  const imageDto: ImageDto = {
    id,
    title,
    url,
    uploader: uploader ? toUserDto(uploader) : null,
    tags,
    comments: comments
      ? comments.map((comment) => toCommentDto(comment))
      : null,
    created_at: created_at,
    likes_count: likes_count ?? null,
  };

  return imageDto;
};

export const toSavedImageDto = (data: SavedImage) => {
  const { id, image } = data;

  const savedImageDto: SavedImageDto = {
    id,
    image: toImageDto(image),
  };

  return savedImageDto;
};
