import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import BooksListScreen from "../screens/BooksListScreen";
import BookFormScreen from "../screens/BookFormScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Stack.Screen name="BooksList" component={BooksListScreen} options={{ title: "Livros" }} />
      <Stack.Screen name="BookForm" component={BookFormScreen} options={{ title: "Livro" }} />
    </Stack.Navigator>
  );
}
