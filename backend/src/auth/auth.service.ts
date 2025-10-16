import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { UserWithoutPassword, LoginResponse } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: {
    emailOrUsername: string;
    password: string;
  }): Promise<UserWithoutPassword | null> {
    let user = await this.usersService.findByEmail(credentials.emailOrUsername);

    if (!user) {
      user = await this.usersService.findByUsername(credentials.emailOrUsername);
    }

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const { password: _password, ...result } = user;
    return result;
  }

  async login(user: UserWithoutPassword): Promise<LoginResponse> {
    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    return this.usersService.create(registerDto);
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    const { password: _password, ...result } = user;
    return result;
  }
}
