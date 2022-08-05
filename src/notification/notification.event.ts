import { Image } from "src/images/entities/image.entity";
import { User } from "src/users/entities/user.entity";
import { NotificationType } from "./notification.entity";

export class NotificationEvent{
  constructor(
    public readonly type: NotificationType,
    public readonly user: User,
    public readonly invoker: User,
    public readonly image?: Image,
  ) {}
}
