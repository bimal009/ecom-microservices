import { prisma, Prisma } from "@repo/product-db";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return res.status(409).json({ 
        message: 'Category with this slug already exists' 
      });
    }

    const category = await prisma.category.create({
      data: { name, slug }
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