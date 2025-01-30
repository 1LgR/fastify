const fastify = require('fastify')({ logger: true });
const setupSwagger = require('./swagger');

setupSwagger(fastify);

let tarefas = [
  { id: 1, descricao: 'Estudar Node.js', feita: false },
  { id: 2, descricao: 'Estudar Fastify', feita: false },
  { id: 3, descricao: 'Estudar Gambiarra', feita: false }
];

fastify.register((app, options, done) => {

  app.get('/tarefas', {
    schema: {
      description: 'Lista todas as tarefas',
      tags: ['Tarefas'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              descricao: { type: 'string' },
              feita: { type: 'boolean' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return tarefas;
  });

  app.post('/tarefas', {
    schema: {
      description: 'Cria uma nova tarefa',
      tags: ['Tarefas'],
      body: {
        type: 'object',
        required: ['descricao'],
        properties: {
          descricao: { type: 'string' },
          feita: { type: 'boolean' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            descricao: { type: 'string' },
            feita: { type: 'boolean' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const novaTarefa = {
      id: tarefas.length + 1,
      descricao: request.body.descricao,
      feita: request.body.feita || false
    };
    tarefas.push(novaTarefa);
    reply.code(201).send(novaTarefa);
  });

  app.put('/tarefas/:id', {
    schema: {
      description: 'Atualiza uma tarefa existente',
      tags: ['Tarefas'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      body: {
        type: 'object',
        properties: {
          descricao: { type: 'string' },
          feita: { type: 'boolean' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            descricao: { type: 'string' },
            feita: { type: 'boolean' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const id = parseInt(request.params.id);
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) {
      reply.code(404).send({ error: 'Tarefa não encontrada' });
      return;
    }
    tarefa.descricao = request.body.descricao || tarefa.descricao;
    tarefa.feita = request.body.feita !== undefined ? request.body.feita : tarefa.feita;
    return tarefa;
  });

  app.delete('/tarefas/:id', {
    schema: {
      description: 'Remove uma tarefa',
      tags: ['Tarefas'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const id = parseInt(request.params.id);
    const index = tarefas.findIndex(t => t.id === id);
    if (index === -1) {
      reply.code(404).send({ error: 'Tarefa não encontrada' });
      return;
    }
    tarefas.splice(index, 1);
    return { message: 'Tarefa removida com sucesso' };
  });

  done(); 
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log(`Servidor rodando em http://localhost:${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();