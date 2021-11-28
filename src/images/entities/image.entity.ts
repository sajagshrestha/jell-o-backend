import { Comment } from 'src/comment/entities/comment.entity';
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
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

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

  @OneToMany((type) => Comment, (comment: Comment) => comment.image, {
    cascade: true,
  })
  comments: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  likes_count?: number;
}
