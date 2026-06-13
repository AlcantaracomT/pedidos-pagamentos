import { Product } from "@/types/product";
import { apiFetch } from "./api";

export function getProducts(storeId = 1) {
  return apiFetch<Product[]>(`/products?storeId=${storeId}`);
}