import { body, param, ValidationChain } from 'express-validator';

class ProductValidation {
    static all(): ValidationChain[] {
        return []; // No validation required for getting all products
    }

    static get(): ValidationChain[] {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer'),
        ];
    }

    static save(): ValidationChain[] {
        return [
            body('name')
                .notEmpty()
                .withMessage('Name is required')
                .isString()
                .withMessage('Name must be a string'),

            body('price')
                .notEmpty()
                .withMessage('Price is required')
                .isDecimal({ decimal_digits: '0,2' })
                .withMessage('Price must be a decimal with up to two decimal places'),

            body('description')
                .optional()
                .isString()
                .withMessage('Description must be a string'),

            body('stock_availability')
                .isInt({ min: 0 })
                .withMessage('Stock availability must be a non-negative integer'),

            body('status_id')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Invalid Status'),
        ];
    }

    static update(): ValidationChain[] {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer'),

            body('name')
                .optional()
                .isString()
                .withMessage('Name must be a string'),

            body('price')
                .optional()
                .isDecimal({ decimal_digits: '0,2' })
                .withMessage('Price must be a decimal with up to two decimal places'),

            body('description')
                .optional()
                .isString()
                .withMessage('Description must be a string'),

            body('stock_availability')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Stock availability must be a non-negative integer'),

            body('status_id')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Status ID must be a positive integer'),
        ];
    }

    static delete(): ValidationChain[] {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer'),
        ];
    }

    static purchase(): ValidationChain[] {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer'),
            body('quantity')
                .isInt({ min: 1 })
                .withMessage('Quantity must be a positive integer'),
        ];
    }

    static success(): ValidationChain[] {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer'),
            param('purchaseId')
                .isInt({ min: 1 })
                .withMessage('Purchase ID must be a positive integer'),
        ];
    }

    static failed(): ValidationChain[] {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer'),
            param('purchaseId')
                .isInt({ min: 1 })
                .withMessage('Purchase ID must be a positive integer'),
        ];
    }
}

export default ProductValidation;
