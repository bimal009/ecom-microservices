import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { shouldBeUser } from './middlewares/auth.middleware.js'

// Define your app environment type
type Env = {
  Variables: {
    userId: string;
  };
};

// Type your Hono app instance
const app = new Hono<Env>()

app.use('*', clerkMiddleware())

app.get('/health', (c) => {
  return c.json({
    status:"ok",
    uptime:process.uptime(),
    timestamp:Date.now()
  })
})

app.get('/test', shouldBeUser, (c) => {
  return c.json({
    message:"Payment Service is running", 
    userId: c.get('userId')
  })
})

const start = async() => {
  try {
    await serve({
      fetch: app.fetch,
      port: 8002
    }, (info) => {
      console.log(`payment Server is running on http://localhost:${info.port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start();