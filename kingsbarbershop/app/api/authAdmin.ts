import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4001/api", 
  headers: { "Content-Type": "application/json" },
});

export class AuthService {
  async login(username: string, password: string): Promise<{ token: string }> {
    try {
        console.log(username + " " + password )
      const res = await api.post<{ status: boolean; data?: { token: string }; message?: string }>("/auth/login", {
        username,
        password,
      });

      if (res.data.status === false) throw new Error(res.data.message || "Erro ao realizar login");

      return res.data.data!;
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      if (err.message) throw err;
      throw new Error("Erro desconhecido ao fazer login");
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const res = await api.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.status === true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}