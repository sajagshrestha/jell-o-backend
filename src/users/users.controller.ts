import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { toImageDto, toSavedImageDto, toUserDto } from 'src/shared/mapper';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { RequestWithUser } from 'src/interface/RequestWithUser';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('feed')
  @UseGuards(AuthGuard())
  async feed(@Req() req: RequestWithUser) {
    const images = await this.usersService.getUserFeeds(req.user);

    return images.map((image) => toImageDto(image));
  }

  @Get('/saved-images')
  @UseGuards(AuthGuard())
  async getSavedImages(@Req() req: RequestWithUser) {
    const savedImages = await this.usersService.getUserSavedImages(req.user);

    return savedImages.map((savedImage) => toSavedImageDto(savedImage));
  }

  @Get('images')
  @UseGuards(AuthGuard())
  async getImages(@Req() req: RequestWithUser) {
    const images = await this.usersService.getUserImages(req.user);

    return images ? images.map((image) => toImageDto(image)) : '';
  }

  @Post(':id/follow')
  @UseGuards(AuthGuard())
  async follow(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: any,
  ) {
    const following = await this.usersService.findById(id);
    await this.usersService.followUser(req.user, following);

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Delete(':id/follow')
  @UseGuards(AuthGuard())
  async unFollow(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: any,
  ) {
    const following = await this.usersService.findById(id);
    await this.usersService.unFollowUser(req.user, following);

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async show(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = await this.usersService.findById(id);
    const { userProfile, images } = await this.usersService.profile(
      user,
      req.user,
    );

    return {
      ...toUserDto(userProfile),
      images: images.map((image) => toImageDto(image)),
    };
  }
}
