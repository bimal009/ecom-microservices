import { StripeProductType } from "@repo/types";
import stripe from "./stripe";

export const createStripeProducts=async(iteam:StripeProductType)=>{
    try {
        const res = await stripe.products.create({
            id:iteam.id,
            name: iteam.name,
            default_price_data:{
                currency:'usd',
                unit_amount: iteam.price * 100,
            }
        })
        return res;
    } catch (error) {
        console.error('Error creating Stripe products:', error);
    }
}


export const getStripeProductsPrics=async(productId:Number)=>{
    try {
        const res = await stripe.prices.list({
            product: String(productId),
        })
        return res.data[0]?.unit_amount;
    } catch (error) {
        console.error('Error creating Stripe products:', error);
    }
}
 
