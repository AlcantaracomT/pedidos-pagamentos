export type Product = {
  id: number;
  name: string;
  price: number | string;
  available: "S" | "N";
  categoryId: number;
  category: string;
  storeId: number;
  storeName: string;
};