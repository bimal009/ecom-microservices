import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { type CustomJwtSessionClaims } from "@repo/types";
declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export const shouldBeUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { userId } = getAuth(req)

  if (!userId) {
    return reply.status(401).send({ error: 'User not authenticated' })
  }

  req.userId = userId
}

export const shouldBeAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  const auth = getAuth(req)

  if (!auth.userId) {
    return reply.status(401).send({ error: 'User not authenticated' })
  }
  const claims = auth.sessionClaims as CustomJwtSessionClaims

  if (claims.metadata?.role !== 'admin') {
    return reply.status(403).send({ error: 'User not authenticated.admin' })
  }

  req.userId = auth.userId
}