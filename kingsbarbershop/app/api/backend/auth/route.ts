import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/backend/controller/authLogin/auth-login-controller";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // ✅ parse do JSON
    console.log("Body recebido no controller:", body);

    const controller = new AuthController();
    const response = await controller.handle(body);

    return NextResponse.json(response);
  } catch (err) {
    console.error("Erro na rota /api/backend/auth:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
