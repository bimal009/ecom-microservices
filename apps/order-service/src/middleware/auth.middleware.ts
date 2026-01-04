import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }}

export const shouldBeUser = async (req: FastifyRequest, reply:FastifyReply) => {
       const {  userId } = getAuth(req)

    if (!userId) {
      return reply.code(401).send({ error: 'User not authenticated' })
    }

   req.userId = userId
}