import { useEffect, useState } from "react";
import { productApi } from "../services/productService";
import type { ApiProduct } from "../features/products/types";

export const useProducts = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getAll();
        setProducts(res); // handles axios or plain response
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};