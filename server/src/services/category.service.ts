import { prisma } from "../utils";
import { ICategory } from "../types/interfaces.types";
import {
  mapCategory,
  CategoryEntity,
  mapCategoryResponse,
} from "../mappers";
import { ApiError } from "../utils";

class CategoryService {
  // =====================================================
  // CREATE CATEGORY
  // =====================================================
  async create(name: string): Promise<ICategory> {
    const existing = await prisma.categories.findFirst({
      where: { name },
    });

    if (existing) {
      throw new ApiError(400, "Category already exists");
    }

    const category = await prisma.categories.create({
      data: { name },
    });

    return mapCategoryResponse(category as CategoryEntity);
  }

  // =====================================================
  // GET ALL CATEGORIES
  // =====================================================
  async getAll(): Promise<ICategory[]> {
    const categories = await prisma.categories.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "desc" },
    });

    return categories.map((cat) =>
      mapCategory(cat as CategoryEntity)
    );
  }

  // =====================================================
  // GET CATEGORY BY ID
  // =====================================================
  async getById(id: number): Promise<ICategory> {
    const category = await prisma.categories.findUnique({
      where: { id },
    });

    if (!category || category.deleted_at) {
      throw new ApiError(404, "Category not found");
    }

    return mapCategoryResponse(category as CategoryEntity);
  }

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================
  async update(id: number, name: string): Promise<ICategory> {
    const category = await prisma.categories.findUnique({
      where: { id },
    });

    if (!category || category.deleted_at) {
      throw new ApiError(404, "Category not found");
    }

    const updated = await prisma.categories.update({
      where: { id },
      data: { name },
    });

    return mapCategoryResponse(updated as CategoryEntity);
  }

  // =====================================================
  // SOFT DELETE CATEGORY
  // =====================================================
  async delete(id: number): Promise<void> {
    const category = await prisma.categories.findUnique({
      where: { id },
    });

    if (!category || category.deleted_at) {
      throw new ApiError(404, "Category not found");
    }

    await prisma.categories.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

export const categoryService = new CategoryService();