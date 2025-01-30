# Tutorial Fastify: CRUD Completo

---

### 1. Criar um banco na memória ou integrar o seu
```javascript
let tarefas = [
  { id: 1, titulo: 'Aprender Fastify', concluida: false },
  { id: 2, titulo: 'Criar API CRUD', concluida: true }
];
```
---

## Operações CRUD

### 1. Listar Tarefas (GET)
```javascript
fastify.get('/tarefas', {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            titulo: { type: 'string' },
            concluida: { type: 'boolean' }
          }
        }
      }
    }
  }
}, async (request, reply) => {
  return tarefas;
});
```

---

### 2. Criar Tarefa (POST)
```javascript
fastify.post('/tarefas', {
  schema: {
    body: {
      type: 'object',
      required: ['titulo'],
      properties: {
        titulo: { type: 'string', minLength: 3 },
        concluida: { type: 'boolean' }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          titulo: { type: 'string' },
          concluida: { type: 'boolean' }
        }
      }
    }
  }
}, async (request, reply) => {
  const novaTarefa = {
    id: tarefas.length + 1,
    titulo: request.body.titulo,
    concluida: request.body.concluida || false
  };
  tarefas.push(novaTarefa);
  reply.code(201).send(novaTarefa);
});
```

---

### 3. Atualizar Tarefa (PUT)
```javascript
fastify.put('/tarefas/:id', {
  schema: {
    params: {
      type: 'object',
      properties: { id: { type: 'number' } }
    },
    body: {
      type: 'object',
      properties: {
        titulo: { type: 'string' },
        concluida: { type: 'boolean' }
      }
    }
  }
}, async (request, reply) => {
  const id = Number(request.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  
  if (!tarefa) {
    return reply.code(404).send({ erro: 'Tarefa não encontrada!' });
  }

  tarefa.titulo = request.body.titulo || tarefa.titulo;
  tarefa.concluida = request.body.concluida ?? tarefa.concluida;
  
  return tarefa;
});
```

---

### 4. Excluir Tarefa (DELETE)
```javascript
fastify.delete('/tarefas/:id', {
  schema: {
    params: {
      type: 'object',
      properties: { id: { type: 'number' } }
    }
  }
}, async (request, reply) => {
  const id = Number(request.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  
  if (index === -1) {
    return reply.code(404).send({ erro: 'Tarefa não encontrada!' });
  }

  tarefas.splice(index, 1);
  return { mensagem: 'Tarefa excluída com sucesso!' };
});
```

---

## Testando a API usando Postman ou Swagger

```bash
# Listar tarefas
URL: GET http://localhost:3000/tarefas - Lista as tarefas

# Criar tarefa
URL: POST http://localhost:3000/tarefas

Objeto JSON:
{
    "descricao": "Teste fastify",
    "feita":true
}


# Atualizar tarefa

URL: PUT http://localhost:3000/tarefas/:ID

Objeto JSON:

{"concluida":true}



# Excluir tarefa
URL: DELETE http://localhost:3000/tarefas/:ID
```

---


