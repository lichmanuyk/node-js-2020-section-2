import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';

import { AuthService } from '../services/index';
import { Config } from '../config/index';
import { AuthJoiValidator, loginPostSchema } from '../validators';

export class AuthController {
  public router = Router();

  constructor(
    private config: Config,
    private validator: AuthJoiValidator,
    private authService: AuthService
  ) {
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
    this.router.post(
      '/login',
      this.validator.validateSchema(loginPostSchema),
      this.login.bind(this)
    );
    this.router.post('/refresh', this.refresh.bind(this));
  }

  private login(req: Request, res: Response) {
    const userName = req.body.username;
    const password = req.body.password;
    const isUserNameAndPaswordValid = this.authService.validatePassword(userName, password);

    if (!userName || !password || !isUserNameAndPaswordValid) {
      return res.status(401).send();
    }

    const payload = { userName };
    const tokens = this.authService.createTokens(payload);

    res.json(tokens);
  }

  private refresh(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const refreshToken = authorization ? authorization.split(' ')[1] : '';

    try {
      const tokens = this.authService.checkAndRefreshTokens(refreshToken);
      res.json(tokens);
    } catch (e) {
      return res.sendStatus(403);
    }
  }
}
