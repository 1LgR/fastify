# Como Adicionar Swagger ao Fastify 📚  

Documente sua API automaticamente com Swagger (OpenAPI) no Fastify em 5 minutos!  

---

## Passo 1: Instalação dos Pacotes
bash  
npm install @fastify/swagger @fastify/swagger-ui  
---

## Passo 2: Configuração Básica  
Adicione ao seu `server.js`:
javascript  
const fastify = require('fastify')({ logger: true });  

// Configurar Swagger  
fastify.register(require('@fastify/swagger'), {  
  openapi: {  
    info: {  
      title: 'API de Tarefas',  
      description: 'Documentação completa da API de gerenciamento de tarefas',  
      version: '1.0.0'  
    },  
    servers: [{ url: 'http://localhost:3000' }],  
    tags: [{ name: 'Tarefas', description: 'Operações com tarefas' }]  
  },  
  exposeRoute: true // Expõe a rota /docs/json  
});  

// Configurar Swagger UI  
fastify.register(require('@fastify/swagger-ui'), {  
  routePrefix: '/docs', // Acesse em http://localhost:3000/docs  
  exposeRoute: true  
});  
---

## Passo 3: Definir Schemas nas Rotas  
Exemplo para rota GET `/tarefas`:
javascript  
fastify.get('/tarefas', {  
  schema: {  
    tags: ['Tarefas'],  
    description: 'Lista todas as tarefas cadastradas',  
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
---

## Passo 4: Acessar a Documentação  
- **Swagger UI**: http://localhost:3000/docs  
- **OpenAPI JSON**: http://localhost:3000/docs/json  

![Swagger UI Preview](https://miro.medium.com/v2/resize:fit:1400/1*1iJ7MhWXH8tKfWk1EEq3Fg.png)  

---

## ⚠️ Erros Comuns (e Soluções)  
1. **Rotas não aparecem**:  
   - Certifique-se de registrar o Swagger **antes** das rotas.  
   - Verifique se os schemas estão definidos corretamente.  

2. **Erro de referência de schema**:
javascript  
   // Adicione no openapi.components:  
   components: {  
     schemas: {  
       Tarefa: {  
         type: 'object',  
         properties: {  
           id: { type: 'number' },  
           titulo: { type: 'string' },  
           concluida: { type: 'boolean' }  
         }  
       }  
     }  
   }  
   
3. **Problemas de validação**:  
   - Use `fastify.setErrorHandler()` para logs detalhados.  

---

## 🔧 Personalização Avançada  
### Adicionar Autenticação à Documentação
javascript  
fastify.register(require('@fastify/swagger'), {  
  openapi: {  
    components: {  
      securitySchemes: {  
        bearerAuth: {  
          type: 'http',  
          scheme: 'bearer',  
          bearerFormat: 'JWT'  
        }  
      }  
    }  
  }  
});  
### Agrupar Rotas por Tags
javascript  
// Na configuração do Swagger:  
tags: [  
  { name: 'Tarefas', description: 'Gestão de tarefas' },  
  { name: 'Usuários', description: 'Autenticação de usuários' }  
]  

// Nas rotas:  
schema: {  
  tags: ['Usuários']  
}  
---

## 🚀 Dicas para Produção  
- Use `@fastify/helmet` para segurança:
bash  
  npm install @fastify/helmet  
  
- Desative o Swagger UI em produção:
javascript  
  exposeRoute: process.env.NODE_ENV !== 'production'  
  
--- 