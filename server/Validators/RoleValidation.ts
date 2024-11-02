import { param, ValidationChain } from 'express-validator';

class RoleValidation {
    static get(): ValidationChain[] {
        return [];
    }

    static assign(): ValidationChain[] {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('Role ID must be a positive integer'),
            
            param('user_id')
                .isInt({ min: 1 })
                .withMessage('User ID must be a positive integer')
        ];
    }
}

export default RoleValidation;
