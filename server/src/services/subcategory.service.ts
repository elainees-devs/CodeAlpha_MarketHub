import { prisma, ApiError } from "../utils";

import {
  SubcategoryResponse,
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from "../schemas";

import { mapSubcategory, SubcategoryEntity } from "../mappers";
import { auditLogService } from "./auditLog.service";

class SubcategoryService {
  // =====================================================
  // GET ALL SUBCATEGORIES (PAGINATED)
  // =====================================================
  async getAllSubcategories(
    page = 1,
    limit = 10
  ): Promise<{
    data: SubcategoryResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [subcategories, total] = await Promise.all([
      prisma.subcategories.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.subcategories.count(),
    ]);

    return {
      data: subcategories.map((sub: SubcategoryEntity) =>
        mapSubcategory(sub)
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // GET SUBCATEGORY BY ID
  // =====================================================
  async getSubcategoryById(id: number): Promise<SubcategoryResponse> {
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
  async createSubcategory(
    data: CreateSubcategoryInput,
    changed_by?: number,
    session_id?: string
  ): Promise<SubcategoryResponse> {
    const { name, category_id } = data;

    const category = await prisma.categories.findUnique({
      where: { id: category_id },
    });

    if (!category || category.deleted_at) {
      throw new ApiError(404, "Category not found");
    }

    const subcategory = await prisma.subcategories.create({
      data: {
        name,
        category_id,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "subcategories",
      record_id: subcategory.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: subcategory,
    });

    return mapSubcategory(subcategory as SubcategoryEntity);
  }

  // =====================================================
  // UPDATE SUBCATEGORY
  // =====================================================
  async updateSubcategory(
    id: number,
    data: UpdateSubcategoryInput,
    changed_by?: number,
    session_id?: string
  ): Promise<SubcategoryResponse> {
    const exists = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Subcategory not found");
    }

    if (data.category_id) {
      const category = await prisma.categories.findUnique({
        where: { id: data.category_id },
      });

      if (!category || category.deleted_at) {
        throw new ApiError(404, "Category not found");
      }
    }

    const updated = await prisma.subcategories.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.category_id && {
          category_id: data.category_id,
        }),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "subcategories",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: updated,
    });

    return mapSubcategory(updated as SubcategoryEntity);
  }

  // =====================================================
  // DELETE SUBCATEGORY (SOFT DELETE)
  // =====================================================
  async deleteSubcategory(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const exists = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Subcategory not found");
    }

    await prisma.subcategories.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "subcategories",
      record_id: id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });
  }

  // =====================================================
  // GET SUBCATEGORIES BY CATEGORY (PAGINATED)
  // =====================================================
  async getByCategory(
    category_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    data: SubcategoryResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [subcategories, total] = await Promise.all([
      prisma.subcategories.findMany({
        where: { category_id },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.subcategories.count({
        where: { category_id },
      }),
    ]);

    return {
      data: subcategories.map((sub: SubcategoryEntity) =>
        mapSubcategory(sub)
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const subcategoryService = new SubcategoryService();