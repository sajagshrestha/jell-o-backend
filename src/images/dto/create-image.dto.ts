import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateImageDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  thumbnailUrl: string;

  @IsString({ each: true })
  tags: string[];
}
