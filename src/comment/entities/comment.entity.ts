import { Image } from 'src/images/entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  body: string;

  @ManyToOne((type) => User, {
    eager: true,
  })
  author: User;

  @ManyToOne((type) => Image, (image: Image) => image.comments, {
    eager: true,
  })
  image: Image;

  @ManyToOne((type) => Comment, (comment) => comment.replies)
  parent?: Comment;

  @OneToMany((type) => Comment, (comment) => comment.parent)
  replies: Comment[];

  replies_count: number;
}
