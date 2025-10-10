import { Profissional } from "@/app/interfaces/profissionaisInterface";

export class CreateProfissionalModel {
  private data: Omit<Profissional, "id">;

  constructor(data: Omit<Profissional, "id" | "procedimentos"> & { procedimentos?: any[] }) {
    this.data = {
      ...data,
      procedimentos: data.procedimentos ?? [], // valor padrão
    };
  }

  toPayload(): Omit<Profissional, "id"> {
    return this.data;
  }
}