import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationEvent } from "./notification.event";
import { NotificationService } from "./notification.service";

@Injectable()
export class NotificationListener{
  constructor(private readonly notificationService: NotificationService){}

  @OnEvent('image.*')
  async onImageActions(data: NotificationEvent) {
    this.notificationService.create(data.user, data.invoker, data.type, data.image);
  }

  @OnEvent('user.follow')
  async onFollow(data: NotificationEvent) {
    this.notificationService.create(data.user, data.invoker, data.type);
  }
}
