import { Request, Response } from 'express';
import { Product,Status, User, Purchase } from '../database/Models';
import StripeService from '../services/StripeService';

class ProductController {
    
    private stripeService: StripeService;
    constructor() {
        this.stripeService = new StripeService();
    }

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

    purchase = async (req: Request, res: Response) =>{
        const {id} = req.params;
        const { quantity } = req.body;

        try {
            const user = await User.findByPk(req.body.authUser);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const unit_price = product.price;
            const total_price = unit_price * quantity;
            const purchase = await Purchase.create({
                user_id: req.body.authUser,
                product_id:product.id,
                unit_price,
                currency: 'INR',
                purchase_type:'payment',
                quantity,
                total_price,
                purchase_status: 'pending',
                created_by: req.body.authUser,
            });
            const line_items = [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: product.name,
                            description: product.description
                        },
                        unit_amount: product.price*100
                    },
                    quantity: quantity
                }
            ]
            const payment = await this.stripeService.pay(line_items,product.id,purchase.id);
            return res.status(201).json({
                url:payment.url,
                message:'Please pay on this link to complete your purchase.'
            });
        } catch (error) {
            console.error('Error creating purchase:', error);
            return res.status(500).json({ message: 'Error creating purchase' });
        }
    }

    success = async (req: Request, res: Response) =>{
        const { id, purchaseId } = req.params;
        const { session } = req.query;
        if(!session) {
            return res.status(404).json({ message: 'Session is required' });
        }
        try {
            const result = await this.stripeService.getSessionResult(session.toString());
            const purchase = await Purchase.findOne({ where: { id: purchaseId, product_id: id } });
            if (!purchase) {
                return res.status(404).json({ message: 'Purchase not found' });
            }
            var message = '';
            console.log(result.status);
            console.log(result.mode);
            console.log(req.body.authUser);
            if (result.status == 'complete') {
                if(result.mode == 'subscription') {
                    const user = await User.findByPk(req.body.authUser);
                    if(user) {
                        user.is_prime_user = true;
                        await user.save();
                    }
                    console.log(user);
                }
                purchase.purchase_status = 'success';
                 message = `Your order of INR ${purchase.total_price} is successfully processed.`;
            } else if (result.status == 'expired') {
                purchase.purchase_status = 'fail';
                 message = `Your payment could not be processed. If any money is deducted, it will be refunded within 48 hours`;
            } else if (result.status == 'open') {
                 message = `Your payment is incomplete. Please complete your payment through this link: ${result.url}`;
            }
            purchase.stripe_session_id = result.id;
            await purchase.save();
            return res.status(200).json({ message: message });
        } catch (error) {
            if(error.type == 'StripeInvalidRequestError') {
                return res.status(404).json({ message: 'Invalid session' });
            }
            console.error('Error updating purchase status:', error);
            return res.status(500).json({ message: 'Error updating purchase status' });
        }
    }

    failed = async (req: Request, res: Response) =>{
        const { id, purchaseId } = req.params;
        const { session } = req.query;
        if(!session) {
            return res.status(404).json({ message: 'Session is required' });
        }
        
        try {
            const purchase = await Purchase.findOne({ where: { id: purchaseId, product_id: id } });
            if (!purchase) {
                return res.status(404).json({ message: 'Purchase not found' });
            }
            if(purchase.purchase_status =='success') {
                return res.status(404).json({ message: 'Invalid Request' });
            }
            const result = await this.stripeService.getSessionResult(session.toString());
            purchase.stripe_session_id = result.id;
            return res.status(200).json({
                message: 'Your payment could not be processed. If any money is deducted, it will be refunded within 48 hours',
            });
        } catch (error) {
            console.error('Error updating purchase status:', error);
            return res.status(500).json({ message: 'Error updating purchase status' });
        }
    }

    productPurchases = async (req:Request,res:Response)=> {
        try {
            const user = await User.findByPk(req.body.authUser);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const purchases = await Purchase.findAll({where:{user_id:user.id}});
            return res.status(200).json({
                data: purchases,
                message: 'Success',
            });
        } catch (error) {
            console.error('Error creating purchase:', error);
            return res.status(500).json({ message: 'Error creating purchase' });
        }
    }

    subscribe = async (req:Request,res:Response)=> {

        try {
            const user = await User.findByPk(req.body.authUser);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if(user.is_prime_user) {
                return res.status(404).json({ message: 'You are already a prime user' });
            }
            const quantity = 1;
            const product = await Product.getAppSubscriptionProduct();
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const unit_price = product.price;
            const total_price = unit_price * quantity;
            const purchase = await Purchase.create({
                user_id: req.body.authUser,
                product_id:product.id,
                unit_price,
                currency: 'INR',
                purchase_type:'subscription',
                quantity,
                total_price,
                purchase_status: 'pending',
                created_by: req.body.authUser,
            });
           
            const payment = await this.stripeService.subscribe(product.id,purchase.id);
            return res.status(201).json({
                url:payment.url,
                message:'Please pay on this link to complete your purchase.'
            });
        } catch (error) {
            console.error('Error creating purchase:', error);
            return res.status(500).json({ message: 'Error creating purchase' });
        }
    }
}

export default new ProductController();
