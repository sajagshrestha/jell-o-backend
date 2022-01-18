import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/interface/RequestWithUser';
import { toImageDto, toUserDto } from 'src/shared/mapper';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(AuthGuard())
  async search(@Query('query') query: string, @Req() req: RequestWithUser) {
    const { images, users } = await this.searchService.search(query, req.user);

    return {
      users: users.map((user) => toUserDto(user)),
      images: images.map((image) => toImageDto(image)),
    };
  }
}
