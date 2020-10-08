import { Router, Request, Response } from 'express';
import { Logger } from 'winston';

import {
  GroupJoiValidator,
  groupPostSchema,
  uniqueGroupNameSchema,
} from '../validators/index';
import { GroupService } from '../services/index';

export class GroupController {
  public router = Router();
  public path = '/groups';

  constructor(
    private validator: GroupJoiValidator,
    private groupService: GroupService,
    private logger: Logger
  ) {
    this.initializeRoutes();
  }

  async initializeRoutes() {
    this.router.get(`${this.path}`, this.getGroups.bind(this));
    this.router.get(`${this.path}/:id`, this.getGroupById.bind(this));
    this.router.post(
      `${this.path}`,
      this.validator.validateSchema(groupPostSchema),
      await this.validator.validateUniqueSchema(uniqueGroupNameSchema),
      this.createGroup.bind(this)
    );
    this.router.post(
      `${this.path}/:id`,
      this.validator.validateSchema(groupPostSchema),
      await this.validator.validateUniqueSchema(uniqueGroupNameSchema),
      this.updateGroup.bind(this)
    );
    this.router.delete(`${this.path}/:id`, this.deleteGroup.bind(this));
  }

  private async getGroups(req: Request, res: Response) {
    try {
      const groupItems = await this.groupService.getGroups();
      res.json({ groupItems });
    } catch (err) {
      this.logger.info('Method: getGroups()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async getGroupById(req: Request, res: Response): Promise<void> {
    try {
      const groupItems = await this.groupService.getGroupById(req.params.id);

      if (!groupItems) {
        res.status(404).send('There is no group with such id');
        return;
      }

      res.json({ groupItems });
    } catch (err) {
      this.logger.info('Method: getGroupById()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const id = await this.groupService.createGroup(req.body);
      res.json({ id });
    } catch (err) {
      this.logger.info('Method: createGroup()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async updateGroup(req: Request, res: Response): Promise<void> {
    try {
      const updatedGroup = await this.groupService.updateGroup(
        req.params.id,
        req.body
      );
      res.json(updatedGroup);
    } catch (err) {
      this.logger.info('Method: updateGroup()', [{ arguments }, {message: err.message}]);
      res.status(400).json(err.message);
    }
  }

  private async deleteGroup(req: Request, res: Response): Promise<void> {
    try {
      await this.groupService.deleteGroup(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      this.logger.info('Method: deleteGroup()', [{ arguments }, {message: err.message}]);
      res.status(404).json(err.message);
    }
  }
}
