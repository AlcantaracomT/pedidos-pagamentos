import { CartProvider } from "@/context/CartContext";
import { colors } from "@/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontSize: 14, fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "CARRINHO" }} />
        <Stack.Screen name="payment" options={{ title: "CARRINHO" }} />
        <Stack.Screen name="pix" options={{ title: "Pagamento via Pix" }} />
      </Stack>
    </CartProvider>
  );
}