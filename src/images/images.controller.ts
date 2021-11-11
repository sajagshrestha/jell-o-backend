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
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/users/dto/user.dto';
import { toImageDto } from 'src/shared/mapper';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() createImageDto: CreateImageDto, @Req() req: any) {
    const user = <UserDto>req.user;

    const image = await this.imagesService.create(user, createImageDto);

    return toImageDto(image);
  }

  @Get()
  async findAll() {
    const images = await this.imagesService.findAll();

    return images.map((image) => toImageDto(image));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const image = await this.imagesService.findOne(+id);

    return toImageDto(image);
  }

  @Get(':id/similar')
  async getSimilarImage(@Param('id') id: string) {
    const similarImages = await this.imagesService.getSimilarImages(+id);

    return similarImages.map((image) => toImageDto(image));
  }

  // @Post(':id/save')
  // async addSavedImage(@Param('id') id: string) {}

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
