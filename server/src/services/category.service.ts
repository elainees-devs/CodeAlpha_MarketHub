import { prisma, ApiError} from "../utils";
import {
  CategoryResponse,
  CreateCategoryInput,
  DeleteCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";

import { mapCategory, CategoryEntity } from "../mappers";
import { auditLogService } from "./auditLog.service";
import { Prisma } from "@prisma/client";

class CategoryService {
  // =====================================================
  // CREATE CATEGORY
  // =====================================================
  async create(
    data: CreateCategoryInput,
    changed_by?: number,
    session_id?: string
  ): Promise<CategoryResponse> {
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

    await auditLogService.createAuditLog({
      table_name: "categories",
      record_id: category.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: category,
    });

    return mapCategory(category as CategoryEntity);
  }

  // =====================================================
  // GET ALL CATEGORIES (WITH SEARCH + PAGINATION)
  // =====================================================
  async getAll(
    page = 1,
    limit = 10,
    search?: string
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

    const where = {
      deleted_at: null,
      ...(search && {
        name: {
          contains: search.trim(),
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.categories.findMany({
        where,
        include: { subcategories: true },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.categories.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: categories.map((cat) => mapCategory(cat as CategoryEntity)),
      meta: { total, page, limit, totalPages },
    };
  }

  // =====================================================
  // GET CATEGORY BY ID
  // =====================================================
  async getById(id: number): Promise<CategoryResponse> {
    const category = await prisma.categories.findUnique({
      where: { id },
      include: { subcategories: true },
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
    data: UpdateCategoryInput,
    changed_by?: number,
    session_id?: string
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
        ...(data.name !== undefined && { name: data.name }),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "categories",
      record_id: updated.id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: category,
      new_data: updated,
    });

    return mapCategory(updated as CategoryEntity);
  }

  // =====================================================
  // SOFT DELETE CATEGORY
  // =====================================================
  async delete(
    data: DeleteCategoryInput,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const category = await prisma.categories.findUnique({
      where: { id: data.id },
    });

    if (!category || category.deleted_at) {
      throw new ApiError(404, "Category not found");
    }

    const updated = await prisma.categories.update({
      where: { id: data.id },
      data: {
        deleted_at: new Date(),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "categories",
      record_id: data.id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: category,
      new_data: updated,
    });
  }
}

export const categoryService = new CategoryService();