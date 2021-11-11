import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  body: string;

  @IsNumber()
  imageId: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}
