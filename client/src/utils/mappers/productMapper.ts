import type { ApiProduct, Product } from "../../features/products/types";

// ==============================
// SINGLE PRODUCT MAPPER
// ==============================
export const mapProductToUI = (product: ApiProduct): Product => {
  // safe image selection
  const mainImage =
    product.product_images?.find((img) => img.is_main)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "";

  const categories =
    product.subcategories?.categories?.name ||
    "Uncategorized";

  const subcategories =
    product.subcategories?.name ?? null;

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price),
    stock: product.stock ?? 0,

    // ==============================
    // IMAGES
    // ==============================
    image: mainImage,
    images: product.product_images?.map((img) => img.image_url) || [],

    // ==============================
    // CATEGORY DATA
    // ==============================
    categories ,
    subcategories,

    // ==============================
    // OPTIONAL FIELDS
    // ==============================
    vendorId: product.vendor_id ?? null,

    createdAt: product.created_at,

    // derived field (useful for UI)
    isNew: isNewProduct(product.created_at),
  };
};

// ==============================
// ARRAY MAPPER
// ==============================
export const mapProductsToUI = (products: ApiProduct[]): Product[] => {
  return products.map(mapProductToUI);
};

// ==============================
// UTILITY: isNew PRODUCT
// ==============================
const isNewProduct = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();

  const diffInDays =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  return diffInDays <= 7;
};