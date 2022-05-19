import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLYogaError } from "@graphql-yoga/node";
import { GraphQLContext } from "./lib/client/context";
import type { Metric } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const typeDefinitions = /* GraphQL */ `
  type Metric {
    id: ID
    uniqueKey: String
    name: String
    metricTimeStamp: String
    unit: String
    qty: Float
  }

  type Query {
    info: String!
    metrics: [Metric]!
  }

  # type Mutation {
  #   # postLink(url: String!, description: String!): Link!
  # }
`;

const resolvers = {
  Query: {
    info: () => `This is the API.`,
    metrics: async (parent: unknown, args: {}, context: GraphQLContext) => await context.prisma.metric.findMany()
  },
  // Mutation: {
  //   // postLink: async (
  //   //   parent: unknown,
  //   //   args: { url: string, description: string },
  //   //   context: GraphQLContext
  //   // ) => {
  //   //   const newLink = await context.prisma.link.create({
  //   //     data: {
  //   //       url: args.url,
  //   //       description: args.description
  //   //     }
  //   //   });
  //   //   return newLink;
  //   // }
  // }
}

export const schema = makeExecutableSchema({
  typeDefs: [typeDefinitions],
  resolvers: [resolvers],
});