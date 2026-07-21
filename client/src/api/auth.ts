import { api } from "./axios";

type AuthResponse = {
  token: string;
  user: { id: string; email: string; role: string };
};

export async function loginRequest(email: string, password: string) {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function registerRequest(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const response = await api.post("/auth/register", data);
  return response.data;
}
