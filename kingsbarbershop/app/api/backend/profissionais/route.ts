import { NextRequest, NextResponse } from "next/server";
import { CreateProfissionalController } from "@/backend/controller/profissional/profissionais-controller";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const controller = new CreateProfissionalController();
  const response = await controller.handle(body);

  return NextResponse.json(response);
}
