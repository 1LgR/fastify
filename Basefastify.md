# Tutorial Fastify: Criando sua Primeira API

---

## 🚀 Iniciando o Projeto

### Passo 1: Inicialize o Node.js

```bash

npm init -y

```

---

### Passo 2: Instale o Fastify

```bash

npm install fastify

```

---

### Passo 3: Crie o Arquivo `server.js`

#### Estrutura Básica do Fastify:

```javascript

const fastify = require('fastify')({ logger: true });

// Rota principal

fastify.get('/', async (request, reply) => {

return { message: 'Olá, Fastify!' };

});

// Inicialização do servidor

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

```

#### Principais Conceitos:

- **Plugins**: Tudo no Fastify é estruturado como plugins, incluindo a instância principal (`fastify`).

- **Logger**: A opção `logger: true` habilita logs automáticos para monitoramento.

---

### Passo 4: Execute o Servidor

```bash

node server.js

```

---

## ⚙️ Funcionamento do Código

| Componente          | Descrição                                                                 |

|---------------------|---------------------------------------------------------------------------|

| `fastify.get()`     | Define uma rota GET para o endpoint raiz (`/`).                           |

| `fastify.listen()`  | Inicia o servidor na porta especificada (3000 neste exemplo).             |

| `logger: true`      | Habilita logs detalhados para depuração (opcional, mas recomendado).      |

---

## 🔍 Testando a API

Acesse no navegador ou via cURL:

```bash

http://localhost:3000

```

**Resposta Esperada:**

```json

{ "message": "Olá, Fastify!" }

```

---

