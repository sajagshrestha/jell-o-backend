import { type } from 'os';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/images/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: false })
  url: string;

  @ManyToOne((type) => User, {
    eager: true,
  })
  uploader: User;

  @JoinTable()
  @ManyToMany((type) => Tag, (tag: Tag) => tag.images, {
    cascade: true,
    eager: true,
  })
  tags?: Tag[];

  @OneToMany((type) => Comment, (comment: Comment) => comment.author)
  comments: Comment[];
}
