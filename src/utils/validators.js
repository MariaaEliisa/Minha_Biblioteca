export function validateBook(book) {
  const errors = [];

  if (!book.title || book.title.trim() === "") {
    errors.push("Título é obrigatório.");
  }
  if (!book.author || book.author.trim() === "") {
    errors.push("Autor é obrigatório.");
  }
  if (!book.year || book.year.trim() === "") {
    errors.push("Ano é obrigatório.");
  }
  if (!book.genre || book.genre.trim() === "") {
    errors.push("Gênero é obrigatório.");
  }

  return errors;
}
