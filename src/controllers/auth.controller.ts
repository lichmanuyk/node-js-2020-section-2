import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';

import { AuthJoiValidator, loginPostSchema } from '../validators';
import { Config } from '../config';
import { Tokens } from '../types/index';

export class AuthController {
  public router = Router();

  private refreshTokens: string[] = [];
  private users = [
    {
      userName: 'John',
      password: '12345jk',
      refreshToken: '',
    },
  ];

  constructor(private config: Config, private validator: AuthJoiValidator) {
    this.initializeRoutes();
  }

  chechAuth(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const accessToken = authorization ? authorization.split(' ')[1] : '';

    if (!accessToken) {
      res.sendStatus(401);
    }

    try {
      jwt.verify(accessToken, this.config.ACCESS_TOKEN_SECRET);
      next();
    } catch (e) {
      return res.sendStatus(403);
    }
  }

  private initializeRoutes() {
    this.router.post('/login', this.validator.validateSchema(loginPostSchema), this.login.bind(this));
    this.router.post('/refresh', this.refresh.bind(this));
  }

  private login(req: Request, res: Response) {
    const userName = req.body.username;
    const password = req.body.password;
    const isUserNameAndPaswordValid = this.validatePassword(userName, password);

    if (!userName || !password || !isUserNameAndPaswordValid) {
      return res.status(401).send();
    }

    const payload = { userName };
    const tokens = this.createTokens(payload);

    res.json(tokens);
  }

  private refresh(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const refreshToken = authorization ? authorization.split(' ')[1] : '';

    try {
      const { userName } = jwt.verify(refreshToken, this.config.REFRESH_TOKEN_SECRET) as {userName: string};

      if (!this.refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
      }

      this.removeOldRefreshToken(refreshToken);
      const tokens = this.createTokens({userName});

      res.json(tokens);
    } catch (e) {
      return res.sendStatus(403);
    }
  }

  private validatePassword(userName: string, password: string): boolean {
    const userProfile = this.users.find(
      (profile) => profile.userName === userName
    );
    const isValid = userProfile ? userProfile.password === password : false;
    return isValid;
  }

  private createTokens(payload: any): Tokens {
    const accessToken = jwt.sign(payload, this.config.ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: this.config.ACCESS_TOKEN_LIFE,
    });

    const refreshToken = jwt.sign(payload, this.config.REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: this.config.REFRESH_TOKEN_LIFE,
    });

    try {
      jwt.verify(refreshToken, this.config.REFRESH_TOKEN_SECRET)
    } catch (e) {
      console.log(e.message)
    }

    this.refreshTokens.push(refreshToken);

    return {accessToken, refreshToken};
  }

  private removeOldRefreshToken(oldRefreshToken: string): void {
    const oldTokenIndex = this.refreshTokens.findIndex(token => token === oldRefreshToken);
    if (oldTokenIndex !== -1) {
      this.refreshTokens.splice(oldTokenIndex, 1);
    }
  }
}
