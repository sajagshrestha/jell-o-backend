import { Image } from 'src/images/entities/image.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Image, (image) => image.tags)
  images?: Image[];

  imageCount?: number;
}
