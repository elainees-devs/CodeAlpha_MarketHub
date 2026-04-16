import { prisma, ApiError } from "../utils";
import { ISubcategory } from "../types/interfaces.types";
import { mapSubcategory,SubcategoryEntity } from "../mappers";


class SubcategoryService {
  // =====================================================
  // GET ALL SUBCATEGORIES
  // =====================================================
  async getAllSubcategories(): Promise<ISubcategory[]> {
    const subcategories = await prisma.subcategories.findMany({
      orderBy: { created_at: "desc" },
    });

    return subcategories.map((sub: SubcategoryEntity) =>
      mapSubcategory(sub)
    );
  }

  // =====================================================
  // GET SUBCATEGORY BY ID
  // =====================================================
  async getSubcategoryById(id: number): Promise<ISubcategory> {
    const subcategory = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!subcategory) {
      throw new ApiError(404, "Subcategory not found");
    }

    return mapSubcategory(subcategory as SubcategoryEntity);
  }

  // =====================================================
  // CREATE SUBCATEGORY
  // =====================================================
  async createSubcategory(data: {
    name: string;
    category_id: number;
  }): Promise<ISubcategory> {
    const category = await prisma.categories.findUnique({
      where: { id: data.category_id },
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const subcategory = await prisma.subcategories.create({
      data: {
        name: data.name,
        category_id: data.category_id,
      },
    });

    return mapSubcategory(subcategory as SubcategoryEntity);
  }

  // =====================================================
  // UPDATE SUBCATEGORY
  // =====================================================
  async updateSubcategory(
    id: number,
    data: Partial<{ name: string; category_id: number }>
  ): Promise<ISubcategory> {
    const exists = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Subcategory not found");
    }

    const subcategory = await prisma.subcategories.update({
      where: { id },
      data,
    });

    return mapSubcategory(subcategory as SubcategoryEntity);
  }

  // =====================================================
  // DELETE SUBCATEGORY
  // =====================================================
  async deleteSubcategory(id: number): Promise<void> {
    const exists = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Subcategory not found");
    }

    await prisma.subcategories.delete({
      where: { id },
    });
  }

  // =====================================================
  // GET SUBCATEGORIES BY CATEGORY
  // =====================================================
  async getByCategory(category_id: number): Promise<ISubcategory[]> {
    const subcategories = await prisma.subcategories.findMany({
      where: { category_id },
      orderBy: { created_at: "desc" },
    });

    return subcategories.map((sub: SubcategoryEntity) =>
      mapSubcategory(sub)
    );
  }
}

export const subcategoryService = new SubcategoryService();