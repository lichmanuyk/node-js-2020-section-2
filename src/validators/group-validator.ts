import Joi from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';

import { GroupService } from '../services/index';

export class GroupJoiValidator {
  constructor(private groupService: GroupService) {}

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
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const groups = await this.groupService.getGroups();
        const arr = [...groups, req.body];
        const { error } = schema.validate(arr, {
          abortEarly: false,
          allowUnknown: false,
        });

        if (error && error.isJoi) {
          res.status(400).json(this.errorResponse(error.details));
        } else {
          next();
        }
      } catch (err) {
        res.status(400).json(err.message);
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
