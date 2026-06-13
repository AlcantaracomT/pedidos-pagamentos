import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../cupom/styles";

type Props = {
    onChange: (valorCupom: number) => void
}

const cupom = 10
export default function Cupom({ onChange }: Props) {
    useEffect(() => {
        onChange(cupom)
    }, [onChange])

    return (
        <View style={styles.containerCupom}>
            <Image
                source={require('../../assets/images/cupom.png')}
                style={{ width: 44, height: 44 }}
            />
            <View >
                <Text style={styles.cupom}>Cupom Aplicado</Text>
                <Text style={styles.cupom}>R$ {cupom}</Text>
            </View>
        </View>
    )
}