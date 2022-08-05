import { Image } from 'src/images/entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
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
    onDelete: 'CASCADE',
  })
  image: Image;

  @ManyToOne((type) => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  parent?: Comment;

  @OneToMany((type) => Comment, (comment) => comment.parent)
  replies: Comment[];

  @CreateDateColumn()
  created_at: Date;

  replies_count: number;
}
