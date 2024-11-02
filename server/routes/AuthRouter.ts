import AuthController from '../controllers/AuthController';
import BaseRouter from './BaseRouter';
import AuthValidation from '../Validators/AuthValidation';

class AuthRouter extends BaseRouter {
    private module = '/auth';
    constructor() {
        super();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.addRoute('post', this.module+'/signup', [ ...AuthValidation.signup(),this.handleValidationErrors,AuthController.signup]);
        this.addRoute('post', this.module+'/login', [ ...AuthValidation.login(),this.handleValidationErrors,AuthController.login]);
        this.addRoute('post', this.module+'/logout', [AuthController.logout]);
    }
}

export default new AuthRouter().getRouter();
