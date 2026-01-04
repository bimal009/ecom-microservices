import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/auth.middleware";
import { connectToOrderDB, Order } from "@repo/order-db";

export async function orderRoutes(app: FastifyInstance) {
  app.get("/user-orders", { preHandler: shouldBeUser }, async (request, reply) => {
    const userId = request.userId
    const orders = await Order.find({
      userId: userId,
    })
    return reply.status(200).send(orders);
  });
  app.get("/orders", { preHandler: shouldBeAdmin }, async (request, reply) => {
    const orders = await Order.find()
    return reply.status(200).send(orders);
  });
}