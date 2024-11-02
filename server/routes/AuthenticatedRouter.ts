import BaseRouter from './BaseRouter';
import RoleController from '../controllers/RoleController';
import ProductController from '../controllers/ProductController';
import RoleValidation from '../Validators/RoleValidation';
import CheckAuthorizationMiddleware from '../middlewares/CheckAuthorizationMiddleware';
import ProductValidation from '../Validators/ProductValidation';

class AuthenticatedRouter extends BaseRouter {
    constructor() {
        super();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //roles
        this.addRoute('get', '/roles', [new CheckAuthorizationMiddleware('get-roles').handle,...RoleValidation.get(),this.handleValidationErrors,RoleController.get]);
        this.addRoute('put', '/roles/:id/assign/:user_id', [new CheckAuthorizationMiddleware('assign-role').handle,...RoleValidation.assign(),this.handleValidationErrors,RoleController.assign]);

        //products
        this.addRoute('get', '/products', [new CheckAuthorizationMiddleware('get-products').handle,...ProductValidation.all(),this.handleValidationErrors,ProductController.all]);
        this.addRoute('get', '/products/:id', [new CheckAuthorizationMiddleware('get-single-product').handle,...ProductValidation.get(),this.handleValidationErrors,ProductController.get]);
        this.addRoute('post', '/products', [new CheckAuthorizationMiddleware('save-product').handle,...ProductValidation.save(),this.handleValidationErrors,ProductController.save]);
        this.addRoute('put', '/products/:id', [new CheckAuthorizationMiddleware('update-product').handle,...ProductValidation.update(),this.handleValidationErrors,ProductController.update]);
        this.addRoute('delete', '/products/:id', [new CheckAuthorizationMiddleware('delete-product').handle,...ProductValidation.delete(),this.handleValidationErrors,ProductController.delete]); 
        
        //purchases
        this.addRoute('get', '/purchases', [new CheckAuthorizationMiddleware('get-purchases').handle]);
        this.addRoute('get', '/purchases/:id', [new CheckAuthorizationMiddleware('get-single-purchase').handle]);
        this.addRoute('post', '/purchases', [new CheckAuthorizationMiddleware('save-purchase').handle]);
    }
}

export default new AuthenticatedRouter().getRouter();
