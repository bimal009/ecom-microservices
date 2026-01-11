// index.ts
import Fastify from 'fastify'
import { clerkClient, clerkPlugin, getAuth } from '@clerk/fastify'
import { shouldBeUser } from './middleware/auth.middleware'
import { connectToOrderDB } from '@repo/order-db'
import { orderRoutes } from './routes/order.route'
import { Consumer, Producer } from './utils/kafka'
import { runKafkaSubscriptions } from './utils/subscritions'

const fastify = Fastify({
  logger: true
})

fastify.register(clerkPlugin)

fastify.get('/health', async (request, reply) => {
  reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  })
})

fastify.get('/test', { preHandler: shouldBeUser }, (request, reply) => {
  return reply.send({
    message: "Order Service is running",
    userId: request.userId
  })
})

fastify.register(orderRoutes)

const start = async () => {
  try {
    await Promise.all([
      Consumer.connect(),
      connectToOrderDB(),
      Producer.connect()
    ])
    
    await runKafkaSubscriptions()
    
    await fastify.listen({ port: 8001 })
    console.log('Order Service is running on port 8001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()