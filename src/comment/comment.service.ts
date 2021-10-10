import { Injectable, NotFoundException } from '@nestjs/common';
import { ImagesService } from 'src/images/images.service';
import { toCommentDto } from 'src/shared/mapper';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { CommentRepository } from './comment.repository';
import { CommentDto } from './dto/commentDto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly usersService: UsersService,
    private readonly imageService: ImagesService,
  ) {}

  async create({ username }: UserDto, createCommentDto: CreateCommentDto) {
    const author = await this.usersService.findByUsername(username, false);

    const parentComment = createCommentDto.parentId
      ? await this.commentRepository.findOne(createCommentDto.parentId)
      : null;

    const image = await this.imageService.findOne(
      createCommentDto.imageId,
      false,
    );

    const comment: Comment = this.commentRepository.create({
      ...createCommentDto,
      parent: parentComment,
      author,
      image: image,
    });
    await this.commentRepository.save(comment);

    return toCommentDto(comment);
  }

  async findAll(id: number) {
    // const comments
    return `This action returns all comment`;
  }

  async findOne(id: number): Promise<CommentDto> {
    const comment = await this.commentRepository.findOne({ id });

    if (!comment) {
      throw new NotFoundException('Comment no found');
    }

    return toCommentDto(comment);
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.preload({
      id: id,
      ...updateCommentDto,
    });

    this.commentRepository.save(comment);
    return this.commentRepository;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
