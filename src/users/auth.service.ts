import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { config } from 'src/config/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(config.salt));

    const hashedPass = await bcrypt.hash(password, salt);

    return hashedPass;
  }

  async comparePassword(newPassword: string, oldPassword: string) {
    const isPasswordValid = await bcrypt.compare(newPassword, oldPassword);

    if (isPasswordValid) {
      return true;
    }

    return false;
  }

  async generateJwtToken(id: string, isAdmin: boolean): Promise<string> {
    try {
      const token = this.jwtService.sign({ _id: String(id), isAdmin });

      return token;
    } catch (error) {
      console.error(`Error generating JWT token: ${error.message}`);

      throw new Error('Failed to generate JWT token');
    }
  }
}
