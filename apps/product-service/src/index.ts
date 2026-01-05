import express, { Request, Response, ErrorRequestHandler } from "express"
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'
import productRouter from "./routes/product.route"
import categoryRouter from "./routes/category.route"
import { rateLimit } from 'express-rate-limit'
import { shouldBeUser } from "./middleware/auth.middleware"
import { Consumer, Producer } from "./utils/kafka"
const app = express()
const PORT = process.env.PORT || 8000
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

app.use(clerkMiddleware())
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}))
app.use(limiter)

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        service: "product-service",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})

app.get('/test', shouldBeUser, (req: Request, res: Response) => {
    res.send("Product Service is running")
})

app.use('/products', productRouter)
app.use('/categories', categoryRouter)

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" })
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}
app.use(errorHandler)

const start=async()=>{
    await Promise.all([await Consumer.connect(),await Producer.connect()])
    try {
       app.listen(PORT,()=>{
        console.log("Product service is running in",PORT)
       })
    } catch (error) {
        
    }
}

start()