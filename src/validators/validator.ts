import Joi from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';

import { UserService } from '../services/index';

export class JoiValidator {

  constructor(private userService: UserService) {}

  public validateSchema(schema: Joi.ObjectSchema<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false,
      });

      if (error && error.isJoi) {
        res.status(400).json(this.errorResponse(error.details));
      } else {
        next();
      }
    };
  }

  public validateUniqueSchema(schema: Joi.ArraySchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const users = this.userService.getAllUsers();
      const arr = [...users, req.body];
      const { error } = schema.validate(arr, {
        abortEarly: false,
        allowUnknown: false,
      });

      if (error && error.isJoi) {
        res.status(400).json(this.errorResponse(error.details));
      } else {
        next();
      }
    };
  }

  private errorResponse(schemaErrors: Joi.ValidationErrorItem[]) {
    const errors = schemaErrors.map((error) => {
      const { path, message } = error;
      return { path, message };
    });
    return {
      status: 'Failed',
      errors,
    };
  }
}
