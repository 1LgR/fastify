// swagger-config.js
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');

const setupSwagger = (fastify) => {
  
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'API de Tarefas',
        description: 'Documentação da API de Tarefas',
        version: '1.0.0'
      },
      servers: [{ url: 'http://localhost:3000' }],
      tags: [{ name: 'Tarefas', description: 'Operações com tarefas' }]
    },
    exposeRoute: true
  });

  
  fastify.register(swaggerUI, {
    routePrefix: '/docs',
    exposeRoute: true
  });
};

module.exports = setupSwagger;