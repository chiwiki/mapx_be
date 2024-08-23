import { Profile } from './profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
