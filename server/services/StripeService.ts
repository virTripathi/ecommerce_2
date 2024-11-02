import 'dotenv/config';
import Stripe from 'stripe';

class StripeService {
    private stripeSecret: string | undefined;
    private stripe: Stripe;
    private appUrl:string|undefined;

    constructor() {
        if (!process.env.STRIPE_SECRET || !process.env.APP_URL) {
            throw new Error('Environment failed');
        }
        this.stripeSecret = process.env.STRIPE_SECRET;
        this.appUrl = process.env.APP_URL;
        this.stripe = new Stripe(this.stripeSecret);
    }

    async pay(line_items:any[],product_id:Number,purchase_id:Number) {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: line_items,
            success_url: `${this.appUrl}/api/products/${product_id}/purchase/${purchase_id}/success?session={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.appUrl}/api/products/${product_id}/purchase/${purchase_id}/failed?session={CHECKOUT_SESSION_ID}`,
        });
        return session;
    }

    async subscribe(product_id:Number, purchase_id:Number) {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
              {
                price: process.env.APP_SUBSCRIPTION_PRICE_ID,
                quantity: 1,
              },
            ],
            success_url: `${this.appUrl}/api/products/${product_id}/purchase/${purchase_id}/success?session={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.appUrl}/api/products/${product_id}/purchase/${purchase_id}/failed?session={CHECKOUT_SESSION_ID}`,
          });
          return session;
    }

    getSessionResult(session:string) {
        return this.stripe.checkout.sessions.retrieve(session);
    }
}

export default StripeService;