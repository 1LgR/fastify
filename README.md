# Tutorial Completo: Fastify e PostgreSQL - Criando uma API Completa

## 🧭 Introdução
Este tutorial irá guiá-lo na criação de uma API completa usando **Fastify** e **PostgreSQL**. Nosso objetivo é ensinar os conceitos fundamentais, boas práticas e fornecer um entendimento profundo do desenvolvimento de APIs modernas.

---

## 🚀 Configurando o Projeto

### 1. Inicialize o Node.js
```bash
npm init -y
```

### 2. Instale as dependências
```bash
npm install fastify pg fastify-plugin fastify-sensible @fastify/swagger @fastify/swagger-ui fastify-env dotenv
```

#### O que cada dependência faz?
- **fastify**: Framework web rápido para Node.js
- **pg**: Cliente PostgreSQL para Node.js
- **fastify-plugin**: Gerencia plugins no Fastify
- **fastify-sensible**: Adiciona manipuladores de erros e respostas padronizadas
- **@fastify/swagger & @fastify/swagger-ui**: Adiciona suporte à documentação da API com Swagger
- **fastify-env**: Carrega variáveis de ambiente do `.env`
- **dotenv**: Gerencia variáveis de ambiente no Node.js

### 3. Estrutura do Projeto
Organize seu projeto da seguinte maneira:
```
fastify-api/
│-- node_modules/
│-- models/
│   ├── tarefa.js
│   ├── usuario.js
│-- routes/
│   ├── tarefas.js
│   ├── usuarios.js
│-- db.js
│-- server.js
│-- .env
│-- package.json
```


---

## 📦 Configurando Banco de Dados (PostgreSQL)

### 1. Instale o PostgreSQL
Caso não tenha instalado, siga as instruções no site oficial: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

### 2. Crie um banco de dados
```sql
CREATE DATABASE fastify_db;
```

### 3. Conectar Fastify ao PostgreSQL e Criar Tabelas Automaticamente
Crie um arquivo `db.js`:
```javascript
const fastifyPlugin = require('fastify-plugin');
const { Client } = require('pg');
require('dotenv').config();

async function dbConnector(fastify, options) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  fastify.decorate('db', client);

  // Criar tabela se não existir
  await client.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      concluida BOOLEAN DEFAULT false
    );
  `);
}

module.exports = fastifyPlugin(dbConnector);
```

Registre o banco no `server.js`:
```javascript
const fastify = require('fastify')({ logger: true });
fastify.register(require('./db'));
```

---

## 📌 Criando Models e Relações

### 1. Criando Model no Fastify
Crie um arquivo `models/tarefa.js`:
```javascript
class TarefaModel {
  constructor(db) {
    this.db = db;
  }

  async listarTodas() {
    const result = await this.db.query('SELECT * FROM tarefas');
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await this.db.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    return result.rows[0];
  }

  async criar(titulo, concluida = false) {
    const result = await this.db.query(
      'INSERT INTO tarefas (titulo, concluida) VALUES ($1, $2) RETURNING *',
      [titulo, concluida]
    );
    return result.rows[0];
  }

  async atualizar(id, titulo, concluida) {
    const result = await this.db.query(
      'UPDATE tarefas SET titulo = $1, concluida = $2 WHERE id = $3 RETURNING *',
      [titulo, concluida, id]
    );
    return result.rows[0];
  }

  async deletar(id) {
    await this.db.query('DELETE FROM tarefas WHERE id = $1', [id]);
    return { message: 'Tarefa removida com sucesso' };
  }
}

module.exports = TarefaModel;
```

Registre no `server.js`:
```javascript
const TarefaModel = require('./models/tarefa');
fastify.decorate('tarefaModel', new TarefaModel(fastify.db));
```

---

## 🛠️ Criando Rotas CRUD

### 1. Listar Tarefas (GET)
```javascript
fastify.get('/tarefas', async (request, reply) => {
  const tarefas = await fastify.tarefaModel.listarTodas();
  return tarefas;
});
```

### 2. Buscar Tarefa por ID (GET)
```javascript
fastify.get('/tarefas/:id', async (request, reply) => {
  const { id } = request.params;
  const tarefa = await fastify.tarefaModel.buscarPorId(id);
  return tarefa || { message: 'Tarefa não encontrada' };
});
```

### 3. Criar Tarefa (POST)
```javascript
fastify.post('/tarefas', async (request, reply) => {
  const { titulo, concluida } = request.body;
  const novaTarefa = await fastify.tarefaModel.criar(titulo, concluida);
  return novaTarefa;
});
```

### 4. Atualizar Tarefa (PUT)
```javascript
fastify.put('/tarefas/:id', async (request, reply) => {
  const { id } = request.params;
  const { titulo, concluida } = request.body;
  const tarefaAtualizada = await fastify.tarefaModel.atualizar(id, titulo, concluida);
  return tarefaAtualizada;
});
```

### 5. Deletar Tarefa (DELETE)
```javascript
fastify.delete('/tarefas/:id', async (request, reply) => {
  const { id } = request.params;
  return await fastify.tarefaModel.deletar(id);
});
```

---

## 📚 Documentando com Swagger

### 1. Instale o Swagger
```bash
npm install @fastify/swagger @fastify/swagger-ui
```

### 2. Configure no `server.js`
```javascript
fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'API de Tarefas',
      version: '1.0.0'
    },
  },
  exposeRoute: true
});

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  exposeRoute: true
});
```

## 📌 Criando Rotas CRUD para Tarefas com Swagger

Crie um arquivo `routes/tarefas.js`:
```javascript
module.exports = async function (fastify, options) {
  fastify.get('/tarefas', {
    schema: {
      description: 'Lista todas as tarefas',
      response: {
        200: {
          type: 'array',
          items: { type: 'object', properties: { id: { type: 'integer' }, titulo: { type: 'string' }, concluida: { type: 'boolean' } } }
        }
      }
    }
  }, async (request, reply) => {
    return await fastify.tarefaModel.listarTodas();
  });

  fastify.post('/tarefas', {
    schema: {
      description: 'Cria uma nova tarefa',
      body: { type: 'object', required: ['titulo'], properties: { titulo: { type: 'string' }, concluida: { type: 'boolean', default: false } } },
      response: { 201: { type: 'object', properties: { id: { type: 'integer' }, titulo: { type: 'string' }, concluida: { type: 'boolean' } } } }
    }
  }, async (request, reply) => {
    const { titulo, concluida } = request.body;
    return await fastify.tarefaModel.criar(titulo, concluida);
  });

  fastify.put('/tarefas/:id', {
    schema: {
      description: 'Atualiza uma tarefa',
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: { type: 'object', properties: { concluida: { type: 'boolean' } } },
      response: { 200: { type: 'object', properties: { id: { type: 'integer' }, titulo: { type: 'string' }, concluida: { type: 'boolean' } } } }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { concluida } = request.body;
    return await fastify.tarefaModel.atualizar(id, concluida);
  });

  fastify.delete('/tarefas/:id', {
    schema: {
      description: 'Deleta uma tarefa',
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: { 200: { type: 'object', properties: { message: { type: 'string' } } } }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    return await fastify.tarefaModel.deletar(id);
  });
};
```

Agora acesse: **[http://localhost:3000/docs](http://localhost:3000/docs)** para visualizar e testar os endpoints.

---



