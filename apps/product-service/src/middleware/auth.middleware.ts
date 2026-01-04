import { getAuth } from "@clerk/express"
import { NextFunction, Request, Response } from "express"

declare global {
    namespace Express {
        interface Request {
             userId:string
        }
    }
}

export const shouldBeUser=async (req:Request,res:Response,next:NextFunction)=>{
    
    const auth = getAuth(req)
      const userId = auth.userId
      if(!userId){
        return res.status(401).json({message:"Unauthorized"})
      }

      req.userId=userId
      next()
}
