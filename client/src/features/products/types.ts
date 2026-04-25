
// ==============================
// BACKEND TYPES (RAW API SHAPE)
// ==============================
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
};

export type ApiSubcategory = {
  id: number;
  name: string;
  categories: ApiCategory;
};

export type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: string; // PostgreSQL DECIMAL → string
  stock: number;
  

  // relationships
  subcategories: ApiSubcategory | null;

  vendor_id?: number | null;

  product_images: ApiProductImage[];

  created_at: string;
  deleted_at: string | null;
};

// API response wrapper
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// ==============================
// FRONTEND TYPE (UI MODEL)
// ==============================
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;

  image: string;
  images: string[];

  categories: string;          // ALWAYS derived from subcategory.category
  subcategories: string | null;

  vendorId?: number | null;
  isNew?: boolean; // UI-only flag to indicate recently added products
  createdAt?: string;
};