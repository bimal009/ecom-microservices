import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { shouldBeUser } from './middlewares/auth.middleware.js'
import SessionRoute from './routes/session.route.js';
import {cors} from 'hono/cors'
import webhookRoute from './routes/webhook.route.js';
import { Consumer, Producer } from './utils/kafka.js';
type Env = {
  Variables: {
    userId: string;
  };
};

const app = new Hono<Env>()
app.use('*', clerkMiddleware())
app.use('*',cors({origin:["http://localhost:3000","http://localhost:3001"]}))

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

app.route('/sessions',SessionRoute)
app.route('/webhooks',webhookRoute)

const start = async() => {
  try {
    Promise.all([await Consumer.connect(),Producer.connect()])
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