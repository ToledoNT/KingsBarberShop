import { CreateProfissionalModel } from "@/backend/model/profissionais/profissionais-model";
import { CreateProfissionalUseCase } from "@/backend/use-cases/profissionais/create-profissional-use-case";

export class CreateProfissionalController {
  async handle(reqBody: { nome: string; email: string; telefone?: string }) {
    const { nome, email, telefone } = reqBody;

    if (!nome || !email) {
      return { status: false, message: "Nome e email são obrigatórios" };
    }

    const payload = new CreateProfissionalModel({
      nome,
      email,
      telefone: telefone ?? "",
      procedimentos: [],
    }).toPayload();

    const novoProf = await new CreateProfissionalUseCase().execute(payload);

    return { status: true, message: "Profissional criado com sucesso", data: novoProf };
  }
}