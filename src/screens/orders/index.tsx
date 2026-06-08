import Botao from "@/components/button";
import Contador from "@/components/contador";
import Cupom from "@/components/cupom";
import Resumo from "@/components/resumo";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { styles } from "./styles";

export default function Orders() {
  const item = [
    { id: 1452, item: "Copo da Felicidade", descricion: 'Copo com brigadeiro, mora...', valor: 18, url: require('../../assets/images/copoFelicidade.png') },
    { id: 1845, item: "Brownie Cremoso", descricion: 'Chocolate 70%, Manteiga, Lei...', valor: 15, url: require('../../assets/images/brow.png') }
  ]

  const [valorProd, setValor] = useState(0)
  const [cupomProd, setCupom] = useState(0)

  function recebeValor(valor: number) {
    setValor(valor)
  }


  function recebeCupom(valorCup: number) {
    setCupom(valorCup)
  }

  let itens = 0
  const qntProd = valorProd
  const valorCupom = cupomProd

  return (
    <View style={styles.screen}>
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
          <Text style={styles.titulo}>Itens (Pedido #{item[itens].id})</Text>

          <View style={styles.containerItem}>
            <Image
              source={item[itens].url}
              style={{ width: 66, height: 66, marginRight: 10 }}
            />

            <View style={styles.info}>
              <Text style={styles.nome}>{item[itens].item}</Text>
              <Text style={styles.desc}>{item[itens].descricion}</Text>
              <Text style={styles.valor}>R$ {item[itens].valor}</Text>
            </View>

            <Contador onChange={recebeValor} />
          </View>
        </View>

        <Cupom onChange={recebeCupom} />
        <Resumo subtotal={item[itens].valor} taxa={5} cupom={valorCupom} quantidade={qntProd} />
      </ScrollView>

      <View style={styles.botaoProximoContainer}>
        <Botao title="Próximo" />
      </View>
    </View>
  )
}