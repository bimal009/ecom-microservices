import express,{Request,Response} from "express"
import cors from "cors"
import { clerkMiddleware, getAuth } from '@clerk/express'
import productRouter from "./routes/product.route.js"
import categoryRouter from "./routes/category.route.js"
import { rateLimit } from 'express-rate-limit'
import { shouldBeUser } from "./middleware/auth.middleware.js"

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8', 
	legacyHeaders: false,
	ipv6Subnet: 56,
})



const app=express()
app.use(clerkMiddleware())
const PORT=process.env.PORT || 8000
app.use(cors({
    origin:["http://localhost:3000","http://localhost:3001"],
    credentials:true
}))
app.use(limiter)
app.use(express.json())

app.get("/health",(req:Request,res:Response)=>{
    res.status(200).json({
    status:"ok",
    uptime:process.uptime(),
    timestamp:Date.now()
  })
})
.get('/test',shouldBeUser,(req:Request,res:Response)=>{
      
    res.send("Product Service is running")
})

app.use('/products',productRouter)
app.use('/categories',categoryRouter)
app.use((err:any, req:Request, res:Response, next:any) => {
    console.error(err);
    res.status(err.status || 500).json({message:err.message || "Internal Server Error"});
  });
app.listen(PORT,()=>{
    console.log(`Product Service is running on port ${PORT}`)
})