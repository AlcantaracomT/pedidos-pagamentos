import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from './styles';

type Props = {
  title: string;
};

export default function Botao({ title }: Props) {
  const [ativo, setAtivo] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.container,{ backgroundColor: ativo ? "#ff4da6" : "#D33535" }]}
      onPress={() => setAtivo(!ativo)}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}