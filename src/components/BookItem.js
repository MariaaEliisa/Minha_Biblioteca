import React from "react";
import { View, Text, Button } from "react-native";

export default function BookItem({ book, onEdit, onDelete }) {
  return (
    <View style={{
      borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8,
      flexDirection: "row", justifyContent: "space-between", alignItems: "center"
    }}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={{ fontWeight: "600" }}>{book.title}</Text>
        <Text>{book.author}</Text>
        <Text>{book.year} - {book.genre}</Text>
        {book.isbn && <Text>ISBN: {book.isbn}</Text>}
      </View>
      <View style={{ gap: 4 }}>
        <Button title="Editar" onPress={() => onEdit(book)} />
        <Button title="Excluir" color="tomato" onPress={() => onDelete(book.id)} />
      </View>
    </View>
  );
}
