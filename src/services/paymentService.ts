import { PaymentMethod } from "@/types/payment";
import { apiFetch } from "./api";

export function getPaymentMethods() {
  return apiFetch<PaymentMethod[]>("/payment-methods");
}