import { Request, Response } from 'express';
import { Product,Status } from '../database/Models';

class ProductController {
    async all(req: Request, res: Response) {
        try {
            const products = await Product.findAll();
            return res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async get(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async save(req: Request, res: Response) {
        const { name, price, description, stock_availability } = req.body;
        const activeStatus = await Status.active();
        const activeStatusId = activeStatus?.id;
        try {
            const newProduct = await Product.create({
                name,
                price,
                description,
                stock_availability,
                status_id: activeStatusId,
                created_by: req.body.authUser,
            });
            return res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, price, description, stock_availability, status_id } = req.body;
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            await product.update({
                name,
                price,
                description,
                stock_availability,
                status_id,
                updated_by: req.body.authUser,
            });
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            await product.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new ProductController();
