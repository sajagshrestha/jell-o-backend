import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Image } from 'src/images/entities/image.entity';
import { ImagesService } from 'src/images/images.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ImagesService))
    private readonly imageService: ImagesService,
  ) {}

  async create(
    { username }: UserDto,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const author = await this.usersService.findByUsername(username);

    const parentComment = createCommentDto.parentId
      ? await this.commentRepository.findOne(createCommentDto.parentId)
      : null;

    const image: Image = <Image>(
      await this.imageService.findOne(createCommentDto.imageId)
    );

    const comment: Comment = this.commentRepository.create({
      ...createCommentDto,
      parent: parentComment,
      image,
      author,
    });
    await this.commentRepository.save(comment);

    return comment;
  }

  async findAll(id: number): Promise<Comment[]> {
    const replies = await this.commentRepository.find({
      where: {
        parent: id,
      },
    });

    return replies;
  }

  async findParentComments(id: number): Promise<Comment[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.parent is NULL')
      .andWhere('comment.image = :id', { id })
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.image', 'image')
      .loadRelationCountAndMap('comment.replies_count', 'comment.replies')
      .getMany();

    return comments;
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ id });

    if (!comment) {
      throw new NotFoundException('Comment no found');
    }

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.preload({
      id: id,
      ...updateCommentDto,
    });

    await this.commentRepository.save(comment);

    return comment;
  }

  async remove(comment: Comment) {
    await this.commentRepository.remove(comment);

    return;
  }
}
