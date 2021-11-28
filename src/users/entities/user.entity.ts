import * as bcrypt from 'bcrypt';
import { Image } from 'src/images/entities/image.entity';
import { SavedImage } from 'src/images/entities/savedImages.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
