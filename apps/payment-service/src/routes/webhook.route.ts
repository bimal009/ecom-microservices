import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";
const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET as string
const webhookRoute=new Hono()

webhookRoute.post("/stripe",async(c)=>{
    const body=await c.req.text()
    const sig=c.req.header("stripe-signature") as string
    let event:Stripe.Event
    try {
        event = Stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (error) {
        console.error("Error processing webhook:", error);
        return c.json({ error: "Webhook error" }, 400);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            const line_items=await stripe.checkout.sessions.listLineItems(
                session.id,
            )
            console.log('Checkout Session Completed:', session);
            break;
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;

    }
})

export default webhookRoute;