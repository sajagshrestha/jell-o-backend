import { DateTime } from 'luxon';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  AfterLoad,
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

  @Column({ nullable: false })
  uploaderId: number;

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

  likeCount: number;

  commentCount?: number;

  /**
   * TypeORM does bot support select and map as of now. This is a workaround method.
   * It counts the row of like table with image id and user id and if it is greater than 1 user has liked the image.
   * Also we could use exist query for boolean value but I am too lazy for that.
   */
  @Column({ nullable: true, insert: false, select: false })
  isLiked: number;

  @Column({ nullable: true, insert: false, select: false })
  isSaved: number;
}
