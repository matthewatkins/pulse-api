import {
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply
} from "fastify";
import { createContext } from '../../lib/client/context';
import { createServer } from '@graphql-yoga/node';
import { schema } from './schema';

const graphQLServer = createServer<{ req: FastifyRequest, reply: FastifyReply }>({
  schema,
  context: createContext
})

const graphQL: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.all('/', async function (req, reply) {
    const response = await graphQLServer.handleIncomingMessage(req, { req, reply });

    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })
    reply.status(response.status);
    reply.send(response.body);
  });
}

export default graphQL;