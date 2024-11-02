import { body, ValidationChain } from 'express-validator';

class AuthValidation {
    static signup(): ValidationChain[] {
        return [
            body('name')
                .isString()
                .withMessage('Name must be a string')
                .notEmpty()
                .withMessage('Name is required'),

            body('email')
                .isEmail()
                .withMessage('Email must be a valid email')
                .notEmpty()
                .withMessage('Email is required'),

            body('mobile_number')
                .isString()
                .withMessage('Mobile number must be a string')
                .isLength({ max: 15 })
                .withMessage('Mobile number must be at most 15 characters'),

            body('address')
                .optional()
                .isString()
                .withMessage('Address must be a string'),

            body('password')
                .isString()
                .withMessage('Password must be a string')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long'),
        ];
    }

    // Validation for user login
    static login(): ValidationChain[] {
        return [
            body('email')
                .isEmail()
                .withMessage('Email must be a valid email')
                .notEmpty()
                .withMessage('Email is required'),

            body('password')
                .isString()
                .withMessage('Password must be a string')
                .notEmpty()
                .withMessage('Password is required'),
        ];
    }
}

export default AuthValidation;
