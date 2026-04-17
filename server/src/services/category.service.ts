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
// GET ALL CATEGORIES (PAGINATED)
// =====================================================
async getAll(
  page = 1,
  limit = 10
): Promise<{
  data: CategoryResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    prisma.categories.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.categories.count({
      where: { deleted_at: null },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: categories.map((cat) =>
      mapCategory(cat as CategoryEntity)
    ),
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
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