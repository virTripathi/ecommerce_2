import { Router } from 'express';
import AuthRouter from './AuthRouter';
import AuthenticatedRouter from './AuthenticatedRouter';

class RouteRegister {
    private apiRoutes = '/api';
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeApiRoutes();
    }

    private initializeApiRoutes() {
        this.router.use(this.apiRoutes, AuthRouter);
        this.router.use(this.apiRoutes, AuthenticatedRouter);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default new RouteRegister().getRouter();
