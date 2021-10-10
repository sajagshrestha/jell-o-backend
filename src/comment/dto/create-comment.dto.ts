import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  body: string;

  @IsNumber()
  imageId: number;

  @IsNumber()
  parentId?: number;
}
