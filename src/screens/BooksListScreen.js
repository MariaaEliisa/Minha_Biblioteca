import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, Alert, Modal, Pressable } from "react-native";
import { listBooks, deleteBook } from "../services/booksApi";
import BookItem from "../components/BookItem";

export default function BooksListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    setRefreshing(true);
    try {
      const list = await listBooks();
      setData(list);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar os livros.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const removeBook = async (id) => {
    try {
      await deleteBook(id);
      setData((prev) => prev.filter((b) => b.id !== id));
      setBookToDelete(null);
      setMessage("Livro excluído com sucesso.");
    } catch {
      Alert.alert("Erro", "Falha ao excluir.");
    }
  };

  const handleDelete = (id) => {
    setMessage("");
    const book = data.find((item) => item.id === id);
    setBookToDelete(book || { id });
  };

  const handleEdit = (book) => {
    navigation.navigate("BookForm", { book });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>Livros</Text>
      {!!message && <Text style={{ color: "#087f23", marginBottom: 12 }}>{message}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <BookItem book={item} onEdit={handleEdit} onDelete={handleDelete} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<Text>Nenhum livro cadastrado.</Text>}
      />
      <Modal
        visible={!!bookToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setBookToDelete(null)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.45)" }}>
          <View style={{ width: "85%", padding: 20, borderRadius: 8, backgroundColor: "white" }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              Confirmar exclusão
            </Text>
            <Text style={{ marginBottom: 20 }}>
              Deseja excluir o livro "{bookToDelete?.title || ""}"?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12 }}>
              <Pressable onPress={() => setBookToDelete(null)}>
                <Text style={{ padding: 10 }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={() => removeBook(bookToDelete.id)}>
                <Text style={{ padding: 10, color: "#b00020", fontWeight: "600" }}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
