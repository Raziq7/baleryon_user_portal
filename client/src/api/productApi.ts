// src/api/productApi.ts
import api from "../utils/baseUrl";
import { AxiosError } from "axios";
import type { ProductDetail } from "../store/types/product";

interface ApiErrorResponse {
  message: string;
}

// | Fetch single product by ID
export const fetchProductById = async (
  productId: string
): Promise<ProductDetail> => {
  try {
    const response = await api.get<ProductDetail>(
      `/api/user/product/getProductDetails?id=${productId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    const message =
      err.response?.data?.message || "Failed to fetch product details";
    throw new Error(message);
  }
};

// (Optional) | Fetch all products
export const fetchAllProducts = async (): Promise<ProductDetail[]> => {
  try {
    const response = await api.get<ProductDetail[]>("/api/user/product");
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch all products"
    );
  }
};

// src/api/productApi.ts
export const fetchProducts = async (
  page = 1,
  limit = 10
): Promise<ProductDetail[]> => {
  const response = await api.get<{ products: ProductDetail[] }>(
    "/api/user/product/getProducts",
    { params: { page, limit } }
  );
  return response.data.products;
};



export const fetchProductsFiltered = async (params: {
  page?: number;
  limit?: number;
  categories?: string[];       // slugs/names
  colors?: string[];           // names, e.g. ["RED","BLUE"]
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc"; // optional
}): Promise<{ products: ProductDetail[]; pageNo: number; totalPages: number; totalProducts: number }> => {
  const {
    page = 1,
    limit = 12,
    categories,
    colors,
    minPrice,
    maxPrice,
    sort,
  } = params;

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (categories?.length) query.set("category", categories.join(","));
  if (colors?.length) query.set("color", colors.join(","));
  if (minPrice != null) query.set("minPrice", String(minPrice));
  if (maxPrice != null) query.set("maxPrice", String(maxPrice));
  if (sort) query.set("sort", sort);

  const { data } = await api.get(`/api/user/product/getProducts?${query.toString()}`);
  return data;
};
