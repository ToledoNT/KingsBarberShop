import { prisma } from "../prisma-connect";

export class DatabaseLog {
  async create(value: any) {
    let retry = 1;
    const maxRetries = 5;

    while (retry < maxRetries) {
      try {
        await prisma.log.create({
          data: { value: JSON.stringify(value) },
        });
        return;
      } catch (error: any) {
        if (retry === maxRetries) {
          console.log("Erro ao criar log.");
        }
        retry++;
      }
    }
  }
}