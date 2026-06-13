import { colors, shadow } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Modal, Pressable, PressableProps, StyleSheet, Text, View, ViewProps } from "react-native";

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function SurfaceCard({ children, style }: ViewProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type ButtonProps = PressableProps & {
  title: string;
  secondary?: boolean;
};

export function PrimaryButton({
  title,
  secondary = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(state) => [
        styles.button,
        secondary && styles.secondaryButton,
        disabled && styles.disabledButton,
        state.pressed && !disabled && styles.buttonPressed,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

type SummaryProps = {
  subtotal: number;
  delivery: number;
  discount: number;
};

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function PurchaseSummary({
  subtotal,
  delivery,
  discount,
}: SummaryProps) {
  const total = Math.max(0, subtotal + delivery - discount);

  return (
    <View style={styles.summary}>
      <SectionTitle>Resumo da compra</SectionTitle>
      <SummaryRow label="Subtotal" value={currency(subtotal)} />
      <SummaryRow label="Taxa de entrega" value={currency(delivery)} />
      <SummaryRow label="Descontos" value={`- ${currency(discount)}`} />
      <View style={styles.divider} />
      <SummaryRow label="Total" value={currency(total)} strong />
    </View>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryText, strong && styles.summaryStrong]}>
        {label}
      </Text>
      <Text style={[styles.summaryText, strong && styles.summaryStrong]}>
        {value}
      </Text>
    </View>
  );
}

export function CouponApplied() {
  return (
    <SurfaceCard style={styles.coupon}>
      <View style={styles.couponIcon}>
        <Ionicons name="ticket-outline" size={22} color={colors.success} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.couponTitle}>Cupom aplicado</Text>
        <Text style={styles.muted}>R$ 10,00 de desconto</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </SurfaceCard>
  );
}

export function SuccessModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={44} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Pedido realizado!</Text>
          <Text style={styles.successText}>
            Acompanhe o preparo do seu pedido.
          </Text>
          <PrimaryButton title="Continuar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export const checkoutStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 130,
  },
  footer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    ...shadow,
  },
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.disabled,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  summary: {
    marginTop: 26,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 10,
  },
  summaryText: {
    color: colors.muted,
    fontSize: 15,
  },
  summaryStrong: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 5,
    backgroundColor: colors.border,
  },
  coupon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  couponIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF7ED",
  },
  couponTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  muted: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: colors.overlay,
  },
  successModal: {
    width: "100%",
    maxWidth: 330,
    padding: 28,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: colors.background,
    ...shadow,
  },
  successCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    backgroundColor: colors.success,
  },
  successTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 8,
  },
  successText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
});
