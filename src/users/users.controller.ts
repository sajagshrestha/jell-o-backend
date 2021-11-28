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
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { toImageDto, toSavedImageDto, toUserDto } from 'src/shared/mapper';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { ImagesService } from 'src/images/images.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/saved-images')
  @UseGuards(AuthGuard())
  async getSavedImages(@Req() req: any) {
    const user = <UserDto>req.user;
    const savedImages = await this.usersService.getUserSavedImages(user);

    return savedImages.map((savedImage) => toSavedImageDto(savedImage));
  }

  @Get('images')
  @UseGuards(AuthGuard())
  async getImages(@Req() req: any) {
    const user = <UserDto>req.user;
    const images = await this.usersService.getUserImages(user);

    return images ? images.map((image) => toImageDto(image)) : '';
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const images = await this.usersService.getUserImages(user);

    return {
      ...toUserDto(user),
      images: images.map((image) => toImageDto(image)),
    };
  }
}
