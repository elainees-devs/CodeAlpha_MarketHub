export type ApiProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  is_main: boolean;
  position: number;
  created_at: string;
  deleted_at: string | null;
};

export type ApiCategory = {
  id: number;
  name: string;
  created_at: string;
  deleted_at: string | null;
};

export type ApiSubcategory = {
  id: number;
  name: string;
  category_id: number;
  created_at: string;
  deleted_at: string | null;
};

export type ApiProduct = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;

  category_id: number;
  subcategory_id: number | null;

  category: ApiCategory;
  subcategory: ApiSubcategory | null;

  created_at: string;
  deleted_at: string | null;

  product_images: ApiProductImage[];
};

export type CreateProductPayload = {
  name: string;
  description?: string | null;
  price: string;
  stock: number;

  category_id: number;
  subcategory_id?: number | null;

  product_images: {
    image_url: string;
    is_main: boolean;
    position: number;
  }[];
};

export type ApiProductsResponse = {
  success: boolean;
  message: string;
  data: ApiProduct[];
};