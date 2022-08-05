import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/interface/RequestWithUser';
import { toNotificationDto } from 'src/shared/mapper';
import { NotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';

interface NotificationReturnType {
  notifications: NotificationDto[];
  unreadCount: number;
}

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard())
  @Get()
  async getNotifications(@Req() req: RequestWithUser): Promise<NotificationReturnType> {
    const {notifications, unreadCount} = await this.notificationService.getNotifications(req.user);
    const notificationDtos = notifications.map(toNotificationDto);

    return {notifications:notificationDtos, unreadCount};
  }

  @Post('read/all')
  @UseGuards(AuthGuard())
  @HttpCode(204)
  async markAsRead(@Req() req: RequestWithUser): Promise<void> {
    await this.notificationService.markAsRead(req.user);

    return;
  }
}
