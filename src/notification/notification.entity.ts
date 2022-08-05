import { Image } from 'src/images/entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  COMMENT_REPLY = 'COMMENT_REPLY',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User,  { nullable: false })
  user: User;

  @ManyToOne(() => User, { nullable: false })
  invoker: User;

  @ManyToOne(() => Image, {
    onDelete: 'CASCADE',
    nullable: true
  })
  image: Image;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'boolean',
    default: false
  })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
