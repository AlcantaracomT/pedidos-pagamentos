import { PrimaryButton, SuccessModal, checkoutStyles } from "@/components/checkout-ui";
import { useCart } from "@/context/CartContext";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PixScreen() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { clearCart } = useCart();

  const params = useLocalSearchParams<{
    orderId?: string;
    total?: string;
  }>();
  return (
    <View style={[checkoutStyles.screen, styles.screen]}>
      <View style={styles.illustration}>
        <View style={styles.phone}>
          <View style={styles.phoneScreen}>
            <Ionicons name="qr-code-outline" size={56} color={colors.primary} />
          </View>
        </View>
        <View style={styles.coin}>
          <Text style={styles.coinText}>$</Text>
        </View>
        <Ionicons
          name="sparkles"
          size={34}
          color="#F2B94B"
          style={styles.sparkle}
        />
      </View>

      <Text style={styles.title}>Aguardando pagamento</Text>
      {params.orderId && (
        <Text style={styles.orderNumber}>Pedido #{params.orderId}</Text>
      )}

      {params.total && (
        <Text style={styles.totalText}>
          Total:{" "}
          {Number(params.total).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      )}
      <Text style={styles.description}>
        Copie o código Pix no seu banco. Assim que o pagamento for reconhecido,
        seu pedido será confirmado.
      </Text>

      <View style={styles.codeBox}>
        <Ionicons name="copy-outline" size={20} color={colors.primary} />
        <Text style={styles.code} numberOfLines={1}>
          00020126580014BR.GOV.BCB.PIX...
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Simular pagamento aprovado"
          onPress={() => setSuccess(true)}
        />
      </View>

      <SuccessModal
        visible={success}
        onClose={() => {
          setSuccess(false);
          clearCart();
          router.dismissAll();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 50,
  },
  illustration: {
    width: 230,
    height: 210,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  phone: {
    width: 114,
    height: 172,
    borderWidth: 7,
    borderColor: colors.text,
    borderRadius: 22,
    padding: 10,
    transform: [{ rotate: "8deg" }],
    backgroundColor: "#F7B7C4",
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF6D9",
  },
  coin: {
    position: "absolute",
    right: 32,
    bottom: 24,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2B94B",
  },
  coinText: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },
  sparkle: {
    position: "absolute",
    left: 29,
    top: 24,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    maxWidth: 330,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 10,
  },
  codeBox: {
    width: "100%",
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    backgroundColor: colors.surface,
  },
  code: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    right: 28,
    bottom: 30,
    left: 28,
  },
  helper: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
  orderNumber: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
  totalText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },
});
