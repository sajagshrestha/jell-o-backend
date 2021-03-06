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
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { ImagesService } from '../services/images.service';
import { CreateImageDto } from '../dto/create-image.dto';
import { UpdateImageDto } from '../dto/update-image.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/users/dto/user.dto';
import { toImageDto, toSavedImageDto } from 'src/shared/mapper';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { User } from 'src/users/entities/user.entity';
import { Image } from '../entities/image.entity';
import { RequestWithUser } from 'src/interface/RequestWithUser';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createImageDto: CreateImageDto,
    @Req() req: RequestWithUser,
  ) {
    const image = await this.imagesService.create(req.user, createImageDto);

    return toImageDto(image);
  }

  @Get('popular')
  @UseGuards(AuthGuard())
  async getPopularImages(@Req() req: RequestWithUser) {
    const popularImages = await this.imagesService.getPopularImages(req.user);

    return popularImages.map((img: Image) => toImageDto(img));
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const image = await this.imagesService.fetchWithDetail(+id, req.user);

    return toImageDto(image);
  }

  @Get(':id/similar')
  @UseGuards(AuthGuard())
  async getSimilarImage(@Param('id') id: string, @Req() req: RequestWithUser) {
    const similarImages = await this.imagesService.getSimilarImages(
      +id,
      req.user,
    );

    return similarImages.map((image) => toImageDto(image));
  }

  @Post(':id/save')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async addSavedImage(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.imagesService.addSavedImage(+id, req.user);

    return { message: 'Successfully saved image' };
  }

  @Delete(':id/save')
  @UseGuards(AuthGuard())
  async removeSavedImage(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.imagesService.removeSavedImage(+id, req.user);

    return { message: 'Successfully removed saved image' };
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @Req() req: RequestWithUser,
  ) {
    const image = await this.imagesService.findOne(+id);
    const ability = this.caslAbilityFactory.createForUser(req.user);

    if (ability.cannot(Action.Update, image)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const updatedImage = await this.imagesService.update(+id, updateImageDto);

    return toImageDto(updatedImage);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string) {
    await this.imagesService.remove(+id);

    return { message: 'Successfully deleted image' };
  }

  @Post(':id/like')
  @UseGuards(AuthGuard())
  addLike(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: any,
  ) {
    try {
      this.imagesService.addLikes(+id, req.user);
    } catch (e) {
      return res.status(400).send(e);
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
