import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";
import { Producer } from "./kafka";

export const createOrder = async (order: OrderType) => {
  const newOrder = new Order(order);

  try {
    const order = await newOrder.save();
    Producer.send("order.created", {
      value: {
        email: order.email,
        amount: order.amount,
        status: order.status,
      },
    });
} catch (error) {
    console.log(error);
    throw error;
  }
};