import { Controller, Get, Query } from '@nestjs/common';
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
}
