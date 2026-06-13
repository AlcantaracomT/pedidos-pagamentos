import { CouponApplied, PrimaryButton, PurchaseSummary, SectionTitle, checkoutStyles } from "@/components/checkout-ui";
import { useCart } from "@/context/CartContext";
import { getProducts } from "@/services/productsService";
import { colors } from "@/theme";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const productImages: Record<number, ImageSourcePropType> = {
  100: require("../../assets/images/pf1carne.png"),
  101: require("../../assets/images/pf2carnes.png"),
  110: require("../../assets/images/lasanha-carne.png"),
  111: require("../../assets/images/lasanha-frango.png"),
  120: require("../../assets/images/refri-caculinha.png"),
  121: require("../../assets/images/refri-lata.png"),
  122: require("../../assets/images/suco-dia.png"),
  130: require("../../assets/images/doce-dia.png"),
};

const fallbackImage = require("../../assets/images/produto-padrao.png");

export default function Orders() {
  const router = useRouter();
  const { setCartItems } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts(1);

        setProducts(data);

        const initialQuantities = data.reduce<Record<number, number>>(
          (acc, product) => {
            acc[product.id] = 1;
            return acc;
          },
          {},
        );

        setQuantities(initialQuantities);
      } catch (err) {
        setError("Não foi possível carregar os produtos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const subtotal = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + Number(product.price) * (quantities[product.id] ?? 1),
        0,
      ),
    [products, quantities],
  );

  const removeProductFromOrder = (productId: number) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );

    setQuantities((currentQuantities) => {
      const updatedQuantities = { ...currentQuantities };
      delete updatedQuantities[productId];
      return updatedQuantities;
    });
  };

  const changeQuantity = (productId: number, amount: number) => {
    const currentQuantity = quantities[productId] ?? 1;

    if (amount < 0 && currentQuantity === 1) {
      removeProductFromOrder(productId);
      return;
    }

    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [productId]: Math.max(1, currentQuantity + amount),
    }));
  };

  if (loading) {
    return (
      <View style={[checkoutStyles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[checkoutStyles.screen, styles.center]}>
        <Ionicons name="alert-circle-outline" size={42} color={colors.primary} />
        <Text style={styles.errorText}>{error}</Text>
        <PrimaryButton title="Tentar novamente" onPress={() => router.replace("/" as Href)} />
      </View>
    );
  }

  return (
    <View style={checkoutStyles.screen}>
      <ScrollView contentContainerStyle={checkoutStyles.content}>
        <View style={styles.storeHeader}>
          <View style={styles.storeIcon}>
            <Ionicons name="storefront-outline" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.storeName}>
              {products[0]?.storeName ?? "Esmeralda Delícias"}
            </Text>
            <Text style={styles.storeLink}>Ir para loja</Text>
          </View>
        </View>

        <SectionTitle>Itens do pedido</SectionTitle>

        {products.length === 0 && (
          <View style={styles.emptyOrder}>
            <Ionicons name="cart-outline" size={38} color={colors.muted} />
            <Text style={styles.emptyOrderTitle}>Seu pedido está vazio</Text>
            <Text style={styles.emptyOrderText}>
              Recarregue a tela para escolher os produtos novamente.
            </Text>
          </View>
        )}

        {products.map((product) => (
          <View key={product.id} style={styles.product}>
            <Image
              source={productImages[product.id] ?? fallbackImage}
              style={styles.productImage}
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.description} numberOfLines={1}>
                {product.category}
              </Text>
              <Text style={styles.price}>
                {Number(product.price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>

            <View style={styles.counter}>
              <Pressable
                hitSlop={8}
                onPress={() => changeQuantity(product.id, -1)}
              >
                <Ionicons
                  name={
                    (quantities[product.id] ?? 1) === 1
                      ? "trash-outline"
                      : "remove"
                  }
                  size={16}
                  color={colors.primary}
                />
              </Pressable>

              <Text style={styles.quantity}>{quantities[product.id] ?? 1}</Text>

              <Pressable
                hitSlop={8}
                onPress={() => changeQuantity(product.id, 1)}
              >
                <Ionicons name="add" size={17} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        ))}

        <CouponApplied />
        <PurchaseSummary subtotal={subtotal} delivery={5} discount={10} />
      </ScrollView>

      <View style={checkoutStyles.footer}>
        <PrimaryButton
          title="Próximo"
          disabled={products.length === 0}
          onPress={() => {
            const selectedItems = products.map((product) => ({
              product,
              quantity: quantities[product.id] ?? 1,
            }));

            setCartItems(selectedItems);

            router.push("/payment" as Href);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: colors.text,
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 18,
  },
  store: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 26,
  },
  storeImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  storeName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  storeLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  productImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 12,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 24,
  },
  storeIcon: {
    width: 60,
    height: 60,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE8EC",
  },
  productInfo: {
    flex: 1,
    paddingRight: 8,
  },
  productName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    color: colors.muted,
    fontSize: 11,
    marginVertical: 3,
  },
  price: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "700",
  },
  counter: {
    minWidth: 70,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
  },
  quantity: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyOrder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyOrderTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
  },
  emptyOrderText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },
});