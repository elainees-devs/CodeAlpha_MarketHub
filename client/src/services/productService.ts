import { apiClient } from "./apiClient";

// ==============================
// TYPES
// ==============================

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  subCategoryId: string;
  vendorId: string;
  images: string[];
};

export type CreateProductPayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  subCategoryId: string;
  vendorId: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ==============================
// PRODUCT API CLASS
// ==============================

class ProductApi {
  // GET ALL PRODUCTS
  async getAll() {
    const res = await apiClient.get("/products");
    return res.data;
  }

  // GET PRODUCT BY ID
  async getById(id: string): Promise<Product> {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  }

  // CREATE PRODUCT (with images)
  async create(data: CreateProductPayload, images?: File[]) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (images) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await apiClient.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }

  // UPDATE PRODUCT
  async update(id: string, data: UpdateProductPayload) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  }

  // DELETE PRODUCT
  async delete(id: string) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }

  // ADD IMAGES
  async addImages(id: string, images: File[]) {
    const formData = new FormData();

    images.forEach((file) => {
      formData.append("images", file);
    });

    const res = await apiClient.post(`/products/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }

  // SET MAIN IMAGE
  async setMainImage(productId: string, imageId: string) {
    const res = await apiClient.patch(
      `/products/${productId}/images/${imageId}/main`
    );
    return res.data;
  }
}

// ==============================
// EXPORT SINGLE INSTANCE
// ==============================

export const productApi = new ProductApi();