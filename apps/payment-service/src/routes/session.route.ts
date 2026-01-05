import { Hono } from "hono";
import stripe from "../utils/stripe";
import { CartItemsType } from "@repo/types";
import { shouldBeUser } from "../middlewares/auth.middleware";
import { getStripeProductsPrices } from "../utils/StripeProducts";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get("userId");

  const lineItems = await Promise.all(
    cart.map(async (item) => {
      const unitAmountFromStripe = await getStripeProductsPrices(item.id);
      if(!unitAmountFromStripe && !item.price){
        throw new Error(`Price not found for product ID: ${item.id}`);
      }
      const unitAmount =
        unitAmountFromStripe ?? Math.round((item.price ?? 0) * 100);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    })
  );

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: "custom",
      return_url:
        "http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}",
    });


    return c.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    }
  );


  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;