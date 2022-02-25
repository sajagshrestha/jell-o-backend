import * as bcrypt from 'bcrypt';
import { Image } from 'src/images/entities/image.entity';
import { SavedImage } from 'src/images/entities/savedImages.entity';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Follow } from './follow.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Image, (image: Image) => image.uploader)
  images: Promise<Image[]>;

  @OneToMany(() => SavedImage, (savedImage: SavedImage) => savedImage.user)
  savedImages: Promise<SavedImage[]>;

  @OneToMany(() => Follow, (follow: Follow) => follow.follower)
  following: Promise<User[]>;

  @OneToMany(() => Follow, (follow: Follow) => follow.following)
  followers: Promise<User[]>;

  /**Check image entity for more info */
  @Column({ nullable: true, insert: false, select: false })
  isFollowing: number;

  followerCount?: number;

  followingCount?: number;

  postCount?: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
