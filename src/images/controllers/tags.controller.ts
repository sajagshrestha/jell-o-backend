import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/interface/RequestWithUser';
import { toImageDto } from 'src/shared/mapper';
import { TagService } from '../services/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagService) {}

  @Get('/search')
  async search(@Query('search') search: string) {
    return this.tagService.find(search);
  }

  @Get('popular')
  async popular() {
    return await this.tagService.popular();
  }

  @Get('/:id/images')
  @UseGuards(AuthGuard())
  async images(@Param('id') id: string, @Req() req: RequestWithUser) {
    const images = await this.tagService.images(+id, req.user);

    return images.map(toImageDto);
  }
}
