import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
  @Column()
  profile_image: string;
  @Column()
  banner_image: string;
  @Column()
  name: string;
  @Column()
  bio: string;
  @Column()
  country: string;
  @Column()
  city: string;
  @Column()
  district: string;
}
