import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
};

export const createContext = async (): Promise<GraphQLContext> => {
  return {
    prisma
  }
}
