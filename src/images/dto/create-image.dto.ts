import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  url: string;

  @IsString({ each: true })
  tags: string[];
}
