export class AuthController {
  async handle(body: { username: string; password: string }) {
    try {
      const { username, password } = body;

      if (!username || !password) {
        return { status: false, message: "Usuário ou senha não enviados" };
      }

      if (username === "admin" && password === "123") {
        return { status: true, data: { token: "meuToken123" } };
      }

      return { status: false, message: "Usuário ou senha inválidos" };
    } catch (err: any) {
      console.error("Erro no controller:", err);
      return { status: false, message: "Erro interno no servidor" };
    }
  }
}