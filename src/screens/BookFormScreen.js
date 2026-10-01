import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { createBook, updateBook } from "../services/booksApi";
import { validateBook } from "../utils/validators";

export default function BookFormScreen({ navigation, route }) {
  const bookToEdit = route.params?.book;
  const isEditing = !!bookToEdit;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && bookToEdit) {
      setTitle(bookToEdit.title || "");
      setAuthor(bookToEdit.author || "");
      setYear(bookToEdit.year || "");
      setGenre(bookToEdit.genre || "");
      setIsbn(bookToEdit.isbn || "");
    }
  }, [isEditing, bookToEdit]);

  const handleSave = async () => {
    setMessage("");
    const book = { title, author, year, genre, isbn };
    const errors = validateBook(book);

    if (errors.length > 0) {
      setMessageIsError(true);
      setMessage(errors.join(" "));
      Alert.alert("Atenção", errors.join(" "));
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await updateBook(bookToEdit.id, book);
        setMessage("Livro atualizado com sucesso!");
        Alert.alert("Sucesso", "Livro atualizado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("BooksList") },
        ]);
      } else {
        await createBook(book);
        setMessage("Livro cadastrado com sucesso!");
        Alert.alert("Sucesso", "Livro cadastrado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("BooksList") },
        ]);
      }
    } catch (e) {
      setMessageIsError(true);
      setMessage(isEditing ? "Não foi possível atualizar o livro." : "Não foi possível cadastrar o livro.");
      Alert.alert("Erro", isEditing ? "Não foi possível atualizar o livro." : "Não foi possível cadastrar o livro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        {isEditing ? "Editar Livro" : "Novo Livro"}
      </Text>
      <TextInput
        placeholder="Título *"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Autor *"
        value={author}
        onChangeText={setAuthor}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Ano *"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Gênero *"
        value={genre}
        onChangeText={setGenre}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="ISBN (opcional)"
        value={isbn}
        onChangeText={setIsbn}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      {loading ? (
        <View style={{ padding: 12, alignItems: "center" }}>
          <ActivityIndicator size="small" />
          <Text style={{ marginTop: 8 }}>{isEditing ? "Atualizando..." : "Salvando..."}</Text>
        </View>
      ) : (
        <Button title={isEditing ? "Atualizar" : "Salvar"} onPress={handleSave} />
      )}
      {!!message && (
        <Text style={{ color: messageIsError ? "#b00020" : "#087f23", marginTop: 8 }}>
          {message}
        </Text>
      )}
    </View>
  );
}
