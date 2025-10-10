// backend/repositories/PrismaProfissionalRepository.ts
import { prisma } from "../prisma-connect";
import type { Profissional } from "@/app/interfaces/profissionaisInterface";
import { ResponseTemplateInterface } from "@/backend/interface/response-templete-interface";
import { ResponseTemplateModel } from "@/backend/interface/response-templete-model";

export class PrismaProfissionalRepository {
  async create(data: Omit<Profissional, "id">): Promise<ResponseTemplateInterface> {
    try {
      const prof = await prisma.profissional.create({ data });
      return new ResponseTemplateModel(true, 201, "Profissional criado com sucesso", prof);
    } catch (error: any) {
      console.error("Erro ao criar profissional:", error);
      return new ResponseTemplateModel(false, 500, "Erro interno ao criar profissional", []);
    }
  }

  async getAll(): Promise<ResponseTemplateInterface> {
    try {
      const profs = await prisma.profissional.findMany({
        orderBy: { nome: "asc" },
      });
      return new ResponseTemplateModel(true, 200, "Profissionais recuperados com sucesso", profs);
    } catch (error: any) {
      console.error("Erro ao recuperar profissionais:", error);
      return new ResponseTemplateModel(false, 500, "Erro interno ao recuperar profissionais", []);
    }
  }

  async getById(id: string): Promise<ResponseTemplateInterface> {
    try {
      const prof = await prisma.profissional.findUnique({ where: { id } });
      if (!prof) return new ResponseTemplateModel(false, 404, "Profissional não encontrado", []);
      return new ResponseTemplateModel(true, 200, "Profissional recuperado com sucesso", prof);
    } catch (error: any) {
      console.error("Erro ao buscar profissional:", error);
      return new ResponseTemplateModel(false, 500, "Erro interno ao buscar profissional", []);
    }
  }

  async update(id: string, data: Partial<Omit<Profissional, "id">>): Promise<ResponseTemplateInterface> {
    try {
      const profExists = await prisma.profissional.findUnique({ where: { id } });
      if (!profExists) return new ResponseTemplateModel(false, 404, "Profissional não encontrado para atualização", []);

      const updatedProf = await prisma.profissional.update({ where: { id }, data });
      return new ResponseTemplateModel(true, 200, "Profissional atualizado com sucesso", updatedProf);
    } catch (error: any) {
      console.error("Erro ao atualizar profissional:", error);
      return new ResponseTemplateModel(false, 500, "Erro interno ao atualizar profissional", []);
    }
  }

  async deleteById(id: string): Promise<ResponseTemplateInterface> {
    try {
      const profExists = await prisma.profissional.findUnique({ where: { id } });
      if (!profExists) return new ResponseTemplateModel(false, 404, "Profissional não encontrado", []);

      await prisma.profissional.delete({ where: { id } });
      return new ResponseTemplateModel(true, 200, "Profissional deletado com sucesso", []);
    } catch (error: any) {
      console.error("Erro ao deletar profissional:", error);
      return new ResponseTemplateModel(false, 500, "Erro interno ao deletar profissional", []);
    }
  }
}