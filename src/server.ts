import { createServer } from '@graphql-yoga/node';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { schema } from './schema';
import { createContext } from './lib/client/context';

const app = fastify({ logger: false });

const graphQLServer = createServer<{ req: FastifyRequest, reply: FastifyReply }>({
  schema,
  context: createContext
})

// '/graphql' is our regular endpoint for GraphQL requests
app.route({
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

// incoming JSON data from Apple Healthkit export
// added as an 'import' route because I'm not sure how to send the data to the GQL resolvers
app.route({
  url: '/import',
  method: 'POST',
  handler: async (req, reply) => {
    const context = await createContext();
    const response = await req;
    const { body }: any = response;

    let dataToSend = {
      uniqueKey: '',
      metricTimeStamp: '',
      name: '',
      unit: '',
      qty: 0
    };

    const getMetrics = body.data.metrics.map((metric: any) => {
      const metricData = metric.data.map((datum: any) => {
        return {
          ...dataToSend,
          uniqueKey: `${datum.date.replace(/ /g, '')}-${metric.units}-${datum.qty}`,
          name: metric.name,
          unit: metric.units,
          metricTimeStamp: datum.date,
          qty: datum.qty
        }
      });

      return metricData;
    });

    const flattenedMetrics = getMetrics.flat();

    await context.prisma.metric.createMany({
      data: flattenedMetrics,
      skipDuplicates: true
    });

    reply.send(flattenedMetrics);
  }
})

app.listen(4000);
