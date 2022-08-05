import { IsNotEmpty } from 'class-validator';
import { ImageDto } from 'src/images/dto/image.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { NotificationType } from './notification.entity';

export class NotificationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  read: boolean;

  @IsNotEmpty()
  user: UserDto

  @IsNotEmpty()
  invoker: UserDto

  image?: ImageDto

  @IsNotEmpty()
  type: NotificationType

  @IsNotEmpty()
  created_at: Date;
}
