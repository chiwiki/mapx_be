import { User } from 'src/entities/user.entity';

export class AuthResponse {
  user: User;
  accessToken: string;
}
