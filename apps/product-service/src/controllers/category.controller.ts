import { prisma, Prisma } from "@repo/product-db";
import { Request, Response } from "express";


export const createCategory = async (req: Request, res: Response) => {
  try {
  
    const data = req.body;
    console.log(data)
    
    const category = await prisma.category.create({
      data: data
    });

    res.status(201).json(category);
  } catch (error: any) {
    console.error('Category creation error:', error);
    return res.status(500).json({ 
      message: 'Failed to create category',
      error: error.message 
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.CategoryUpdateInput = req.body;

  const category = await prisma.category.update({
    where: {
      id: id
    },
    data: data
  });
  
  return res.status(200).json(category);
}

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
}

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedCategory = await prisma.category.delete({
    where: {
      id: id
    }
  });
  
  res.status(200).json(deletedCategory);
}