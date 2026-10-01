import { booksHttp } from "./api";

export async function listBooks() {
  const { data } = await booksHttp.get("");
  return data;
}

export async function createBook(book) {
  const { data } = await booksHttp.post("", book);
  return data;
}

export async function updateBook(id, book) {
  const { data } = await booksHttp.put(`/${id}`, book);
  return data;
}

export async function deleteBook(id) {
  await booksHttp.delete(`/${id}`);
}
