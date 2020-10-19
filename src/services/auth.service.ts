import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { Config } from '../config/index';
import { RefreshTokenInfo, Tokens } from '../types/index';
import { UserService } from './user.service';

export class AuthService {
  private refreshTokens: RefreshTokenInfo[] = [];

  constructor(private config: Config, private userService: UserService) {}

  async validatePassword(userName: string, password: string): Promise<boolean> {
    try {
      const users = await this.userService.getUsers();
      const userProfile = users.find((profile) => profile.login === userName);
      const isValid = userProfile ? userProfile.password === password : false;
      return isValid;
    } catch (err) {
      throw err;
    }
  }

  createTokens(userName: string): Tokens {
    const accessToken = jwt.sign(
      { userName },
      this.config.ACCESS_TOKEN_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: this.config.ACCESS_TOKEN_LIFE,
      }
    );

    const refreshToken = uuid();

    this.refreshTokens.push({
      token: refreshToken,
      creationData: new Date(),
      userName,
    });

    return { accessToken, refreshToken };
  }

  checkAndRefreshTokens(refreshToken: string): Tokens {
    try {
      const refreshTokenInfo = this.refreshTokens.find(
        (tokenInfo) => tokenInfo.token === refreshToken
      );
      if (!refreshTokenInfo) {
        throw new Error('No such refresh token');
      }

      const isExpired =
        new Date().getMilliseconds() -
          refreshTokenInfo.creationData.getMilliseconds() >
        this.config.REFRESH_TOKEN_LIFE;
      if (isExpired) {
        throw new Error('Refresh token is expired');
      }

      this.removeOldRefreshToken(refreshTokenInfo.token);
      const tokens = this.createTokens(refreshTokenInfo.userName);

      return tokens;
    } catch (err) {
      throw err;
    }
  }

  private removeOldRefreshToken(oldRefreshToken: string): void {
    const oldTokenIndex = this.refreshTokens.findIndex(
      (tokenInfo) => tokenInfo.token === oldRefreshToken
    );
    if (oldTokenIndex !== -1) {
      this.refreshTokens.splice(oldTokenIndex, 1);
    }
  }
}
