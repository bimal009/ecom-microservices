import { Request, Response } from "express";
import { Prisma, prisma } from "@repo/product-db";

export const createProduct = async (req: Request, res: Response) => {
    const data: Prisma.ProductCreateInput = req.body;

    const product = await prisma.product.create({
        data: data,
    });

    res.status(201).json(product);
};
export const updateProduct=(req:Request,res:Response)=>{}
export const getProducts=(req:Request,res:Response)=>{}
export const getProduct=(req:Request,res:Response)=>{}
export const deleteProduct=(req:Request,res:Response)=>{}