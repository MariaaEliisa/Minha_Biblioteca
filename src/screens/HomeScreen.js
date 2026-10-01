import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function HomeScreen({ navigation }) {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Minha Biblioteca</Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>Bem-vindo à sua biblioteca!</Text>
      <Button title="Ver livros" onPress={() => navigation.navigate("BooksList")} />
      <Button title="Cadastrar livro" onPress={() => navigation.navigate("BookForm")} />
      <View style={{ height: 16 }} />
      <Button title="Sair" color="tomato" onPress={signOut} />
    </View>
  );
}
