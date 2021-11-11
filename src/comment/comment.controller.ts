import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { toCommentDto } from 'src/shared/mapper';
import { UserDto } from 'src/users/dto/user.dto';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/commentDto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/replies/:id')
  async getReplies(@Param('id') id: string): Promise<CommentDto[]> {
    const comments = await this.commentService.findAll(+id);

    return comments.map((comment) => toCommentDto(comment));
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ): Promise<CommentDto> {
    const user = <UserDto>req.user;

    const comment = await this.commentService.create(user, createCommentDto);

    return toCommentDto(comment);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDto> {
    const comment = await this.commentService.update(+id, updateCommentDto);

    return toCommentDto(comment);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
