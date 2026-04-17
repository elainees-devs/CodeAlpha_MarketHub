import { prisma, ApiError } from "../utils";
import {
  CategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";

import { mapCategory, CategoryEntity } from "../mappers";

class CategoryService {
  // =====================================================
  // CREATE CATEGORY
  // =====================================================
  async create(data: CreateCategoryInput): Promise<CategoryResponse> {
    const { name } = data;

    const existing = await prisma.categories.findFirst({
      where: {
        name,
        deleted_at: null,
      },
    });

    if (existing) {
      throw new ApiError(400, "Category already exists");
    }

    const category = await prisma.categories.create({
      data: { name },
    });

    return mapCategory(category as CategoryEntity);
  }

  // =====================================================
  // GET ALL CATEGORIES
  // =====================================================
  async getAll(): Promise<CategoryResponse[]> {
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
  async getById(id: number): Promise<CategoryResponse> {
    const category = await prisma.categories.findUnique({
      where: { id },
    });

    if (!category || category.deleted_at) {
      throw new ApiError(404, "Category not found");
    }

    return mapCategory(category as CategoryEntity);
  }

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================
  async update(
    id: number,
    data: UpdateCategoryInput
  ): Promise<CategoryResponse> {
    const category = await prisma.categories.findUnique({
      where: { id },
    });

    if (!category || category.deleted_at) {
      throw new ApiError(404, "Category not found");
    }

    const updated = await prisma.categories.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
      },
    });

    return mapCategory(updated as CategoryEntity);
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