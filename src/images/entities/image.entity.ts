import { DateTime } from 'luxon';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
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
import { Like } from './like.entity';
import { Tag } from './tag.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  caption: string;

  @Column('text', { nullable: false })
  url: string;

  @Column('text', { nullable: false })
  thumbnailUrl: string;

  @ManyToOne(() => User, {
    eager: true,
  })
  uploader: User;

  @JoinTable()
  @ManyToMany(() => Tag, (tag: Tag) => tag.images, {
    cascade: true,
    eager: true,
  })
  tags?: Tag[];

  @OneToMany(() => Comment, (comment: Comment) => comment.image, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => Like, (like: Like) => like.image)
  likes: Like[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  likes_count?: number;
}
