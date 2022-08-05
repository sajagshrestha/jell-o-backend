import { Injectable } from '@nestjs/common';
import { Image } from 'src/images/entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import { Notification, NotificationType } from './notification.entity';
import { NotificationRepository } from './notification.repository';

interface NotificationReturnType {
  notifications: Notification[];
  unreadCount: number;
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async getNotifications(user: User): Promise<NotificationReturnType> {
    const notifications = await this.notificationRepository.find({
      where: {
        user,
      },
      relations: ['invoker', 'user', 'image'],
    });

    const unreadCount = await this.notificationRepository.count({
      where: {
        user,
        read: false,
      },
    });

    return { notifications, unreadCount };
  }

  async markAsRead(user: User): Promise<void> {
    await this.notificationRepository.update({ user }, { read: true });
  }

  async create(user: User, invoker:User, notificationType: NotificationType, image?:Image ): Promise<void> {
    console.log(user, invoker, notificationType, image);
    
    await this.notificationRepository.save({ user, invoker, type:notificationType, image });
  }
}
