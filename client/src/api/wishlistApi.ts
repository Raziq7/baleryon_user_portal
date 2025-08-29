import type { ProductSize } from "../store/types/product";
import api from "../utils/baseUrl"; // Adjust path as needed

// Get token safely (recommended to fetch inside a function, not top-level)
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getWishlist = async () => {
  const token = getToken();
  const response = await api.get("/api/user/wishlist/", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const addToWishlist = async (
  productId: string,
  size: ProductSize[],
  color: string
): Promise<any> => {
  const token = getToken();
  const response = await api.post(
    "/api/user/wishlist/",
    {
      productId,
      size,
      color,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const removeFromWishlist = async (productId: string): Promise<any> => {
  const token = getToken();
  const response = await api.delete(`/api/user/wishlist/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const removeAllWishList = async (): Promise<any> => {
  const token = getToken();
  const response = await api.delete(`/api/user/wishlist/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
