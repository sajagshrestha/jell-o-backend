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
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('feed')
  @UseGuards(AuthGuard())
  async feed(@Req() req: any) {
    const user: User = req.user;
    const images = await this.usersService.getUserFeeds(user);

    return images.map((image) => toImageDto(image));
  }

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

  @Post(':id/follow')
  @UseGuards(AuthGuard())
  async follow(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const user = <User>req.user;
    const following = await this.usersService.findById(id);
    await this.usersService.followUser(user, following);

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Delete(':id/follow')
  @UseGuards(AuthGuard())
  async unFollow(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const user = <User>req.user;
    const following = await this.usersService.findById(id);
    await this.usersService.unFollowUser(user, following);

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const images = await this.usersService.getUserImages(user);
    const { followersCount, followingCunt } =
      await this.usersService.getFollowersAndFollowing(user);

    return {
      ...toUserDto(user),
      followersCount,
      followingCunt,
      images: images.map((image) => toImageDto(image)),
    };
  }
}
