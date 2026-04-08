import Botao from "@/components/botton";
import { Image, ScrollView, Text, View } from "react-native";
import { styles } from "./styles";

export default function Orders() {
  const item = [
    { id: 1, item: "Copo da Felicidade", descricion: 'Copo com brigadeiro, mora...', valor: 18 }
  ]

  let itens = 0
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.containerLoja}>
        <Image
          source={require('../../assets/images/loja.png')}
          style={{ width: 66, height: 66 }}
        />
        <View>
          <Text>JP Confeitaria</Text>
          <Text style={styles.containerLojaLink}>Ir para loja</Text>
        </View>
      </View>

      <View>
        <Text style={styles.titulo}>Itens (Pedido #1452)</Text>

        <View style={styles.containerItem}>
          <Image
            source={require('../../assets/images/copoFelicidade.png')}
            style={{ width: 66, height: 66, marginRight: 10 }}
          />

          <View style={styles.info}>
            <Text style={styles.nome}>{item[itens].item}</Text>
            <Text style={styles.desc}>{item[itens].descricion}</Text>
            <Text style={styles.valor}>R$ {item[itens].valor}</Text>
          </View>

          <View style={styles.controls}>
            <Text style={styles.apagar}>🗑</Text>
            <Text>1</Text>
            <Text style={styles.apagar}>+</Text>
          </View>
        </View>
      </View>

      <View style={styles.containerCupom}>
        <Image
          source={require('../../assets/images/cupom.png')}
          style={{ width: 44, height: 44 }}
        />
        <View >
          <Text style={styles.cupom}>Cupom Aplicado</Text>
          <Text style={styles.cupom}>R$ 10,00</Text>
        </View>
      </View>

      <View style={styles.containerResumo}>
        <Text style={styles.h1}>Resumo da Compra</Text>

        <View style={styles.linha}>
          <Text style={styles.p}>Subtotal</Text>
          <Text style={styles.p}>R$ {item[0].valor},00</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.p}>Taxa de Entrega</Text>
          <Text style={styles.p}>R$ 5,00</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.p}>Descontos</Text>
          <Text style={styles.p}>- R$ 2,00</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.h1}>Total</Text>
          <Text style={styles.h1}>R$ 23,00</Text>
        </View>
      </View>
      <Botao title="Proximo" />
    </ScrollView>
  )
}