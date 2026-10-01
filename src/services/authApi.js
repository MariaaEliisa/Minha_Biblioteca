import { authHttp } from "./api";

export async function loginReqRes({ email, password }) {
  const { data } = await authHttp.post("/login", { email, password });
  return data.token;
}
