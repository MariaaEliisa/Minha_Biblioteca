import axios from "axios";

export const MOCKAPI_BASE = "https://6ab691a6c4c7bb67b918f272.mockapi.io/livros";

export const booksHttp = axios.create({
  baseURL: MOCKAPI_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const authHttp = axios.create({
  baseURL: "https://reqres.in/api",
  timeout: 10000,
  headers: {
    "x-api-key": "reqres-free-v1",
    "Content-Type": "application/json",
  },
});
