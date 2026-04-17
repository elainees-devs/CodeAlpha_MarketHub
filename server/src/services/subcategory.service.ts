import { prisma, ApiError } from "../utils";
import {
  SubcategoryResponse,
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from "../schemas";

import { mapSubcategory, SubcategoryEntity } from "../mappers";

class SubcategoryService {
  // =====================================================
  // GET ALL SUBCATEGORIES
  // =====================================================
  async getAllSubcategories(): Promise<SubcategoryResponse[]> {
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
  async getSubcategoryById(
    id: number
  ): Promise<SubcategoryResponse> {
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
    data: CreateSubcategoryInput
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

    return mapSubcategory(subcategory as SubcategoryEntity);
  }

  // =====================================================
  // UPDATE SUBCATEGORY
  // =====================================================
  async updateSubcategory(
    id: number,
    data: UpdateSubcategoryInput
  ): Promise<SubcategoryResponse> {
    const exists = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Subcategory not found");
    }

    // validate category if being updated
    if (data.category_id) {
      const category = await prisma.categories.findUnique({
        where: { id: data.category_id },
      });

      if (!category || category.deleted_at) {
        throw new ApiError(404, "Category not found");
      }
    }

    const subcategory = await prisma.subcategories.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.category_id && {
          category_id: data.category_id,
        }),
      },
    });

    return mapSubcategory(subcategory as SubcategoryEntity);
  }

  // =====================================================
  // DELETE SUBCATEGORY (SOFT DELETE)
  // =====================================================
  async deleteSubcategory(id: number): Promise<void> {
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
  }

  // =====================================================
  // GET SUBCATEGORIES BY CATEGORY
  // =====================================================
  async getByCategory(
    category_id: number
  ): Promise<SubcategoryResponse[]> {
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