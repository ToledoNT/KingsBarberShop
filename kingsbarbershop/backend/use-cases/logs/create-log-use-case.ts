import { DatabaseLog } from "@/backend/db/repositories/prisma-logs-repository";
import { ResponseTemplateInterface } from "@/backend/interface/response-templete-interface.js";

export class CreateLog {
  async execute(value: ResponseTemplateInterface): Promise<void> {
    await new DatabaseLog().create(value);
    return;
  }
}