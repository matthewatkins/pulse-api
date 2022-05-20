import Fastify from 'fastify';

const port = process.env.PORT || 4000;

const fastify = Fastify({ logger: false });

fastify.register(import('./routes/import'));
fastify.register(import('./routes/graphql'));

fastify.listen(port);
