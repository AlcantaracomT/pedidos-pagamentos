import { Text, View } from "react-native";
import { styles } from "./styles";

type Props = {
    subtotal: number,
    taxa: number,
    cupom: number,
    quantidade: number,
}

export default function Resumo({ subtotal, taxa, cupom, quantidade}: Props) {
    let sub = subtotal
    if(quantidade > 0){
        sub = subtotal*quantidade
    }

    let total = sub+taxa-cupom
    if( total < 0){
        total = 0
    }

    return (
        <View style={styles.containerResumo}>
            <Text style={styles.h1}>Resumo da Compra</Text>

            <View style={styles.linha}>
                <Text style={styles.p}>Subtotal</Text>
                <Text style={styles.p}>R$ {sub},00</Text>
            </View>

            <View style={styles.linha}>
                <Text style={styles.p}>Taxa de Entrega</Text>
                <Text style={styles.p}>R$ {taxa},00</Text>
            </View>

            <View style={styles.linha}>
                <Text style={styles.p}>Descontos</Text>
                <Text style={styles.p}>- R$ {cupom},00</Text>
            </View>

            <View style={styles.linha}>
                <Text style={styles.h1}>Total</Text>
                <Text style={styles.h1}>R$ {total},00</Text>
            </View>
        </View>
    )
}