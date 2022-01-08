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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/users/dto/user.dto';
import { toImageDto, toSavedImageDto } from 'src/shared/mapper';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { User } from 'src/users/entities/user.entity';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() createImageDto: CreateImageDto, @Req() req: any) {
    const user = <UserDto>req.user;

    const image = await this.imagesService.create(user, createImageDto);

    return toImageDto(image);
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

  @Post(':id/save')
  @UseGuards(AuthGuard())
  async addSavedImage(@Param('id') id: string, @Req() req: any) {
    const user = <UserDto>req.user;
    const savedImage = await this.imagesService.addSavedImage(+id, user);

    return toSavedImageDto(savedImage);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = <User>req.user;
    const image = await this.imagesService.findOne(+id);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Update, image)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    await this.imagesService.update(+id, updateImageDto);

    return toImageDto(image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard())
  addLike(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const user = <UserDto>req.user;
    try {
      this.imagesService.addLikes(+id, user);
    } catch (e) {
      return res.status(400).send(e);
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
