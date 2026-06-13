import {
  CouponApplied,
  PrimaryButton,
  PurchaseSummary,
  SuccessModal,
  SurfaceCard,
  checkoutStyles,
} from "@/components/checkout-ui";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/ordersService";
import { colors, shadow } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PaymentMethod = "pix" | "card" | "cash" | null;

const paymentLabels: Record<Exclude<PaymentMethod, null>, string> = {
  pix: "Pix",
  card: "Cartão de crédito",
  cash: "Dinheiro",
};

const paymentMethodIds: Record<Exclude<PaymentMethod, null>, number> = {
  cash: 1,
  pix: 2,
  card: 3,
};

export default function PaymentScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cashModal, setCashModal] = useState(false);
  const [cashValue, setCashValue] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const { items, subtotal, delivery, discount, clearCart } = useCart();

  const selectMethod = (nextMethod: Exclude<PaymentMethod, null>) => {
    setMethod(nextMethod);
    setMenuOpen(false);
    if (nextMethod === "cash") {
      setCashModal(true);
    }
  };

  const canFinish =
    Boolean(method) &&
    items.length > 0 &&
    (method !== "card" || Boolean(selectedCard));

  const getPaymentDetails = () => {
    if (method === "cash") {
      return cashValue ? `Troco para R$ ${cashValue}` : "Sem troco";
    }

    if (method === "card") {
      return selectedCard ? `Cartão final ${selectedCard}` : "Cartão";
    }

    if (method === "pix") {
      return "Pagamento via Pix";
    }

    return "";
  };

  const finish = async () => {
    if (!method) {
      Alert.alert("Atenção", "Escolha uma forma de pagamento.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Atenção", "Seu carrinho está vazio.");
      router.replace("/" as Href);
      return;
    }

    if (method === "card" && !selectedCard) {
      Alert.alert("Atenção", "Selecione um cartão.");
      return;
    }

    try {
      setLoading(true);

      const order = await createOrder({
        clientId: 1,
        paymentMethodId: paymentMethodIds[method],
        paymentDetails: getPaymentDetails(),
        delivery,
        discount,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      setCreatedOrderId(order.orderId);

      if (method === "pix") {
        router.push({
          pathname: "/pix",
          params: {
            orderId: String(order.orderId),
            total: String(order.total),
          },
        } as Href);
        return;
      }

      setSuccess(true);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível finalizar o pedido. Verifique se o backend e o banco estão rodando.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={checkoutStyles.screen}>
      <ScrollView contentContainerStyle={checkoutStyles.content}>
        <View style={styles.storeHeader}>
          <View style={styles.storeIcon}>
            <Ionicons name="storefront-outline" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.storeName}>
              {items[0]?.product.storeName ?? "Esmeralda Delícias"}
            </Text>
            <Text style={styles.storeLink}>Ir para loja</Text>
          </View>
        </View>

        <Text
          style={[
            styles.heading,
            !createdOrderId && styles.headingWithoutOrder,
          ]}
        >
          Pagamento do pedido
        </Text>

        {createdOrderId && (
          <Text style={styles.orderNumber}>Pedido #{createdOrderId}</Text>
        )}

        <View style={styles.selectWrapper}>
          <Pressable
            style={styles.select}
            onPress={() => setMenuOpen((current) => !current)}
          >
            <Text style={[styles.selectText, !method && styles.placeholder]}>
              {method ? paymentLabels[method] : "Escolher forma de pagamento"}
            </Text>
            <Ionicons
              name={menuOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.primary}
            />
          </Pressable>

          {menuOpen && (
            <View style={styles.menu}>
              <PaymentOption
                icon="cash-outline"
                title="Dinheiro (pagamento na entrega)"
                onPress={() => selectMethod("cash")}
              />
              <PaymentOption
                icon="logo-usd"
                title="Pix"
                onPress={() => selectMethod("pix")}
              />
              <PaymentOption
                icon="card-outline"
                title="Cartão de crédito"
                onPress={() => selectMethod("card")}
                last
              />
            </View>
          )}
        </View>

        {method === "card" && (
          <View style={styles.cardSection}>
            <Text style={styles.label}>Selecione um cartão</Text>
            <CardOption
              brand="MC"
              number="•••• 624"
              selected={selectedCard === "624"}
              onPress={() => setSelectedCard("624")}
            />
            <CardOption
              brand="VISA"
              number="•••• 1071"
              selected={selectedCard === "1071"}
              onPress={() => setSelectedCard("1071")}
            />
          </View>
        )}

        {method === "cash" && (
          <SurfaceCard style={styles.cashCard}>
            <Ionicons name="cash-outline" size={25} color={colors.success} />
            <View style={styles.flex}>
              <Text style={styles.cashTitle}>Pagamento em dinheiro</Text>
              <Text style={styles.muted}>
                {cashValue
                  ? `Troco para R$ ${cashValue}`
                  : "Não preciso de troco"}
              </Text>
            </View>
            <Pressable onPress={() => setCashModal(true)}>
              <Text style={styles.changeLink}>Alterar</Text>
            </Pressable>
          </SurfaceCard>
        )}

        <CouponApplied />
        <PurchaseSummary
          subtotal={subtotal}
          delivery={delivery}
          discount={discount}
        />
      </ScrollView>

      <View style={checkoutStyles.footer}>
        <PrimaryButton
          title={
            loading
              ? "Finalizando..."
              : method === "pix"
                ? "Gerar Pix"
                : "Finalizar compra"
          }
          disabled={!canFinish || loading}
          onPress={finish}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loading}
          />
        )}
      </View>

      <CashModal
        visible={cashModal}
        value={cashValue}
        onChange={setCashValue}
        onConfirm={() => setCashModal(false)}
        onClose={() => setCashModal(false)}
        onNoChange={() => {
          setCashValue("");
          setCashModal(false);
        }}
      />
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

function PaymentOption({
  icon,
  title,
  onPress,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      style={[styles.menuItem, last && styles.menuItemLast]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={19} color={colors.primary} />
      <Text style={styles.menuText}>{title}</Text>
    </Pressable>
  );
}

function CardOption({
  brand,
  number,
  selected,
  onPress,
}: {
  brand: string;
  number: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.cardOption, selected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.cardBrand}>
        <Text style={styles.cardBrandText}>{brand}</Text>
      </View>
      <Text style={styles.cardNumber}>{number}</Text>
      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={20}
        color={selected ? colors.primary : colors.muted}
      />
    </Pressable>
  );
}

function CashModal({
  visible,
  value,
  onChange,
  onConfirm,
  onNoChange,
  onClose,
}: {
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onNoChange: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.modalTitle}>Precisa de troco?</Text>
          <Text style={styles.modalText}>
            Digite o valor que você pagará em dinheiro para que o entregador
            leve o troco certo.
          </Text>
          <TextInput
            value={value}
            onChangeText={(text) => onChange(text.replace(/[^0-9,]/g, ""))}
            placeholder="R$ 0,00"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            style={styles.cashInput}
          />
          <PrimaryButton
            title="Confirmar"
            disabled={!value}
            onPress={onConfirm}
          />
          <PrimaryButton
            title="Não quero troco"
            secondary
            onPress={onNoChange}
            style={styles.noChangeButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  storeName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  storeLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  heading: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  headingWithoutOrder: {
    marginBottom: 14,
  },
  orderNumber: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  selectWrapper: {
    zIndex: 2,
  },
  select: {
    minHeight: 45,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
  },
  selectText: {
    color: colors.text,
    fontSize: 13,
  },
  placeholder: {
    color: colors.muted,
  },
  menu: {
    position: "absolute",
    top: 49,
    right: 0,
    left: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.background,
    ...shadow,
  },
  menuItem: {
    minHeight: 45,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    color: colors.text,
    fontSize: 13,
  },
  cardSection: {
    marginTop: 18,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardOption: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#FFF8F8",
  },
  cardBrand: {
    minWidth: 42,
    height: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
  },
  cardBrandText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: "800",
  },
  cardNumber: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
  },
  cashCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
  },
  cashTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  muted: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
  },
  changeLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: colors.overlay,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    padding: 26,
    borderRadius: 12,
    backgroundColor: colors.background,
    ...shadow,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 5,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 18,
  },
  cashInput: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  noChangeButton: {
    marginTop: 10,
  },
  loading: {
    marginTop: 10,
  },
});
