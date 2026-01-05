import { prisma, Prisma } from "@repo/product-db";
import { Request, Response } from "express";



export const createCategory = async (req: Request, res: Response) => {
  const data: Prisma.CategoryCreateInput = await req.body;

  const category = await prisma.category.create({
    data
  });

  res.status(201).json(category);
};

export const updateCategory=async (req:Request,res:Response)=>{
    const {id}=req.params;
    const data:Prisma.CategoryUpdateInput=req.body;

    const category=await prisma.category.update({
        where:{
            id:id
        },
        data:data
    });
    return res.status(200).json(category);
}
export const getCategories=async(req:Request,res:Response)=>{
    const categories=await prisma.category.findMany();
    res.status(200).json(categories);
}
export const deleteCategory=async(req:Request,res:Response)=>{
    const { id } = req.params;
    const deleteCategory=await prisma.category.delete({
        where:{
            id:id
        }
    });
    res.status(200).json(deleteCategory);
}