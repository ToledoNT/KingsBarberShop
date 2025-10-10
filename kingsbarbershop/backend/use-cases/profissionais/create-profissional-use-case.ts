import { prisma } from "@/backend/db/prisma-connect";
import { Profissional } from "@/app/interfaces/profissionaisInterface";

export class CreateProfissionalUseCase {
  async execute(data: Omit<Profissional, "id">) {
    const novoProf = await prisma.profissional.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        procedimentos: {
          create: data.procedimentos ?? [],
        },
      },
    });

    return novoProf;
  }
}