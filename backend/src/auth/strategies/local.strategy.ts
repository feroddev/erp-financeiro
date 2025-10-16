import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserWithoutPassword } from '../interfaces/jwt-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'emailOrUsername',
      passwordField: 'password',
    });
  }

  async validate(emailOrUsername: string, password: string): Promise<UserWithoutPassword> {
    const user = await this.authService.validateUser(emailOrUsername, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
