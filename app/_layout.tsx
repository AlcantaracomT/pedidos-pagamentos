import { Stack } from "expo-router";
import { StackScreen } from "expo-router/build/layouts/stack-utils";

export default function RootLayout() {
  return (
  <Stack>
    <StackScreen name="index" options={{headerTitle: "Carrinho"}}/>
  </Stack>
);
}
