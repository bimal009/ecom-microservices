import { Request, Response } from "express";
import { Prisma, prisma } from "@repo/product-db";
import { Producer } from "../utils/kafka";
import { StripeProductType } from "@repo/types";

export const createProduct = async (req: Request, res: Response) => {
    const data: Prisma.ProductCreateInput = await req.body;
    const {colors, images} = data;

    if(!colors || !Array.isArray(colors) || colors.length === 0){
       return res.status(400).json({message: "At least one color is required"});
    }

    if(!images || typeof images !== 'object'){
       return res.status(400).json({message: "At least one image is required"});
    }

    const missingColors = colors.filter(color => !(color in images));
    
    if(missingColors.length > 0){
       return res.status(400).json({message: `Images for colors ${missingColors.join(", ")} are missing`});
    }
    
    const product = await prisma.product.create({
        data: data,
    });
    const stripeProduct:StripeProductType={
        id:product.id,
        name:product.name,
        price:product.price
    }

    await Producer.send("product.created",{value:stripeProduct})

    res.status(201).json(product);
}
export const updateProduct=async (req:Request,res:Response)=>{
    const {id}=req.params;
    const data:Prisma.ProductUpdateInput=req.body;

    const product=await prisma.product.update({
        where:{
            id:id
        },
        data:data
    });
    return res.status(200).json(product);
}
export const getProducts = async (req: Request, res: Response) => {
    const { sort, search, limit, category } = req.query;

    const orderBy = (() => {
        switch (sort) {
            case "asc":
                return { price: Prisma.SortOrder.asc };
            case "desc":
                return { price: Prisma.SortOrder.desc };
            case "oldest":
                return { createdAt: Prisma.SortOrder.asc };
            default:
                return { createdAt: Prisma.SortOrder.desc };
        }
    })();

    const products = await prisma.product.findMany({
        where: {
            category: {
                slug: category as string
            },
            name: {
                contains: search as string,
                mode: "insensitive"
            }
        },
        orderBy: orderBy,
        take: limit ? parseInt(limit as string) : undefined,
    });
    
    res.status(200).json(products);
}
export const getProduct=async (req:Request,res:Response)=>{
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: {
            id: id,
        },
    });
    res.status(200).json(product);
}
export const deleteProduct=async(req:Request,res:Response)=>{
    const { id } = req.params;
  const deleteProduct=await prisma.product.delete({
        where:{
            id:id
        }
    });
    res.status(200).json(deleteProduct);
}