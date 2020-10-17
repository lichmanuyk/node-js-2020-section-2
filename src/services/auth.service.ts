import jwt from 'jsonwebtoken';

import { Config } from '../config/index';
import { Tokens } from '../types/index';

export class AuthService {
  private refreshTokens: string[] = [];
  private users = [
    {
      userName: 'John',
      password: '12345jk',
      refreshToken: '',
    },
  ];

  constructor(private config: Config) {}

  validatePassword(userName: string, password: string): boolean {
    const userProfile = this.users.find(
      (profile) => profile.userName === userName
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
