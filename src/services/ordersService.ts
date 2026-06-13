import { apiFetch } from "./api";

type CreateOrderItem = {
  productId: number;
  quantity: number;
};

type CreateOrderPayload = {
  clientId?: number;
  paymentMethodId: number;
  paymentDetails?: string;
  delivery?: number;
  discount?: number;
  items: CreateOrderItem[];
};

export function createOrder(payload: CreateOrderPayload) {
  return apiFetch<{
    orderId: number;
    subtotal: number;
    delivery: number;
    discount: number;
    total: number;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}