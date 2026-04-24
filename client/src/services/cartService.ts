import { apiClient } from "./apiClient";

// ==============================
// TYPES
// ==============================

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CreateCartItemPayload = {
  cart_id: string;
  product_id: string;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};

// ==============================
// CART API CLASS
// ==============================

class CartApi {
  // ADD ITEM TO CART
  async addItem(data: CreateCartItemPayload) {
    const res = await apiClient.post("/cart/items", data);
    return res.data;
  }

  // GET ALL ITEMS IN CART
  async getCartItems(cartId: string): Promise<CartItem[]> {
    const res = await apiClient.get(`/cart/cart/${cartId}`);
    return res.data;
  }

  // GET SINGLE CART ITEM
  async getCartItemById(itemId: string): Promise<CartItem> {
    const res = await apiClient.get(`/cart/${itemId}`);
    return res.data;
  }

  // UPDATE ITEM QUANTITY
  async updateQuantity(itemId: string, data: UpdateCartItemPayload) {
    const res = await apiClient.patch(`/cart/${itemId}`, data);
    return res.data;
  }

  // REMOVE ITEM FROM CART
  async removeItem(itemId: string) {
    const res = await apiClient.delete(`/cart/${itemId}`);
    return res.data;
  }

  // CLEAR CART
  async clearCart(cartId: string) {
    const res = await apiClient.delete(`/cart/cart/${cartId}/clear`);
    return res.data;
  }
}

// ==============================
// EXPORT SINGLE INSTANCE
// ==============================

export const cartApi = new CartApi();