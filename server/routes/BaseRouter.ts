import { Router } from 'express';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';


class BaseRouter {
    protected router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        return this.router;
    }

    protected addRoute(method: 'get' | 'post' | 'put' | 'patch' | 'delete', path: string, handler: any) {
        this.router[method](path, ...handler);
    }

    protected handleValidationErrors(req: Request, res: Response, next: Function) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
}

export default BaseRouter;
