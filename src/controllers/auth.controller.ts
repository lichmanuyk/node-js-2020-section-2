import { Request, Response, NextFunction, Router } from 'express';
import { Logger } from 'winston';
import jwt from 'jsonwebtoken';

import { AuthService } from '../services/index';
import { Config } from '../config/index';
import { AuthJoiValidator, loginPostSchema } from '../validators';


declare global {
  namespace Express {
    interface Request {
      userName: string;
    }
  }
}

export class AuthController {
  public router = Router();

  constructor(
    private config: Config,
    private validator: AuthJoiValidator,
    private authService: AuthService,
    private logger: Logger
  ) {
    this.initializeRoutes();
  }

  chechAuth(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const accessToken = authorization ? authorization.split(' ')[1] : '';

    if (!accessToken) {
      this.logger.error('No access token provided');
      res.sendStatus(401);
    }

    try {
      const { userName } = jwt.verify(
        accessToken,
        this.config.ACCESS_TOKEN_SECRET
      ) as { userName: string };
      req.userName = userName;
      next();
    } catch (e) {
      this.logger.error(e.message);
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

  private async login(req: Request, res: Response) {
    const userName = req.body.username;
    const password = req.body.password;
    try {
      const isUserNameAndPaswordValid = await this.authService.validatePassword(
        userName,
        password
      );
      if (!userName || !password || !isUserNameAndPaswordValid) {
        return res.sendStatus(401);
      }
    } catch (e) {
      this.logger.error(e.message);
      return res.sendStatus(401);
    }

    const tokens = this.authService.createTokens(userName);

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
