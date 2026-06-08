import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./style";

type Props = {
    onChange: (valor: number) => void
}

export default function Contador({ onChange }: Props) {
    const [quantidade, setQuantidade] = useState(1);

    function aumenta() {
        const qnt = quantidade + 1
        onChange(qnt)
        setQuantidade(quantidade + 1);
    }

    function diminui() {
        const qnt = quantidade - 1
        onChange(qnt)
        setQuantidade(quantidade - 1);
    }

    return (
        <View style={styles.controls}>

            <Pressable onPress={() => {
                if (quantidade > 1) {
                    diminui();
                }
            }}>
                <Text style={styles.apagar}>🗑</Text>
            </Pressable>

            <Text>{quantidade}</Text>

            <Pressable onPress={aumenta}>
                <Text style={styles.mais}>+</Text>
            </Pressable>

        </View >
    );
}