import type {
  ApiProduct,
  ApiProductsResponse,
  CreateProductPayload,
} from "../features/products/types";
import { apiClient } from "./apiClient";

class ProductApi {
  // ==============================
  // GET ALL PRODUCTS
  // ==============================
  async getAll(): Promise<ApiProduct[]> {
    const res = await apiClient.get<ApiProductsResponse>("/products");

    return res.data.data ?? [];
  }

  // ==============================
  // GET PRODUCT BY ID
  // ==============================
  async getById(id: number): Promise<ApiProduct> {
    const res = await apiClient.get<{ data: ApiProduct }>(`/products/${id}`);

    return res.data.data;
  }

  async create(
  data: CreateProductPayload,
  images?: File[],
): Promise<ApiProduct> {
  const formData = new FormData();

  // append JSON fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  // append images
  if (images?.length) {
    images.forEach((file) => formData.append("images", file));
  }

  const res = await apiClient.post<{ data: ApiProduct }>(
    "/products",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data.data;
}
  // ==============================
  // UPDATE PRODUCT
  // ==============================
  async update(id: number, data: Partial<ApiProduct>): Promise<ApiProduct> {
    const res = await apiClient.put<{ data: ApiProduct }>(
      `/products/${id}`,
      data,
    );

    return res.data.data;
  }

  // ==============================
  // DELETE PRODUCT
  // ==============================
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }

  // ==============================
  // ADD IMAGES
  // ==============================
  async addImages(id: number, images: File[]) {
    const formData = new FormData();

    images.forEach((file) => formData.append("images", file));

    const res = await apiClient.post(`/products/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  }

  // ==============================
  // SET MAIN IMAGE
  // ==============================
  async setMainImage(productId: number, imageId: number) {
    const res = await apiClient.patch(
      `/products/${productId}/images/${imageId}/main`,
    );

    return res.data;
  }
}

export const productApi = new ProductApi();
