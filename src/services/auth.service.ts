import jwt from 'jsonwebtoken';

import { Config } from '../config/index';
import { Tokens } from '../types/index';
import { UserService } from './user.service';

export class AuthService {
  private refreshTokens: string[] = [];

  constructor(private config: Config, private userService: UserService) {}

  async validatePassword(userName: string, password: string): Promise<boolean> {
    const users = await this.userService.getUsers();
    const userProfile = users.find(
      (profile) => profile.login === userName
    );
    const isValid = userProfile ? userProfile.password === password : false;
    return isValid;
  }

  createTokens(payload: any): Tokens {
    const accessToken = jwt.sign(payload, this.config.ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: this.config.ACCESS_TOKEN_LIFE,
    });

    const refreshToken = jwt.sign(payload, this.config.REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: this.config.REFRESH_TOKEN_LIFE,
    });

    this.refreshTokens.push(refreshToken);

    return { accessToken, refreshToken };
  }

  checkAndRefreshTokens(refreshToken: string): Tokens {
    const { userName } = jwt.verify(
      refreshToken,
      this.config.REFRESH_TOKEN_SECRET
    ) as { userName: string };

    if (!this.refreshTokens.includes(refreshToken)) {
      throw new Error();
    }

    this.removeOldRefreshToken(refreshToken);
    const tokens = this.createTokens({ userName });

    return tokens;
  }

  private removeOldRefreshToken(oldRefreshToken: string): void {
    const oldTokenIndex = this.refreshTokens.findIndex(
      (token) => token === oldRefreshToken
    );
    if (oldTokenIndex !== -1) {
      this.refreshTokens.splice(oldTokenIndex, 1);
    }
  }
}
