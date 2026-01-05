import { getAuth } from "@clerk/express"
import { NextFunction, Request, Response } from "express"
import type { CustomJwtSessionClaims } from "@repo/types"
declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export const shouldBeUser = async (req: Request, res: Response, next: NextFunction) => {

  const auth = getAuth(req)
  const userId = auth.userId
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  req.userId = userId
  next()
}


export const shouldBeAdmin = async (req: Request, res: Response, next: NextFunction) => {

  const auth = getAuth(req)
  const userId = auth.userId
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const claims = auth.sessionClaims as CustomJwtSessionClaims
console.log(claims.metadata?.role)
  if (claims.metadata?.role !== 'admin') {
    return res.status(403).json({ message: "Unauthorized" })
  }
  req.userId = userId
  next()
}
