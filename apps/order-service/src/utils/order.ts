import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";

export const createOrder = async (order: OrderType) => {
    console.log("Creating order:", order)
    
    try {
        const newOrder = new Order(order)
        const res = await newOrder.save()
        console.log("Order created successfully:", res)
        return res
    } catch (error) {
        console.error("Error creating order:", error)
        throw error
    }
}