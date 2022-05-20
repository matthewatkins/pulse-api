import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from "fastify";
import { createContext } from '../lib/client/context';
import { createServer } from '@graphql-yoga/node';
import { schema } from '../schema';


const graphQLServer = createServer<{ req: FastifyRequest, reply: FastifyReply }>({
  schema,
  context: createContext
})

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      console.log('request', req.body);

      const response = await graphQLServer.handleIncomingMessage(req, { req, reply });

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })
      reply.status(response.status);
      reply.send(response.body);
    }
  })
}