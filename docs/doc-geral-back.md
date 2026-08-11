# Documentação do Backend — Ponto 8 WebApp

> Sistema de gestão para oficina mecânica. Este documento cobre **apenas o backend** do projeto (`/backend`), incluindo arquitetura, configuração, modelo de dados e todos os endpoints da API.

---

## 1. Visão geral

O backend é uma API REST construída em **Node.js + TypeScript**, usando **Express 5** e **PostgreSQL** (via `pg`), com autenticação baseada em **JWT + refresh token** e geração de PDFs de ordens de serviço com **PDFKit**.

### 1.1 Stack e dependências

| Dependência | Uso |
|---|---|
| `express` | Servidor HTTP e roteamento |
| `pg` | Driver PostgreSQL (`Pool`) |
| `jsonwebtoken` | Emissão/verificação de access tokens JWT |
| `bcrypt` | Hash de senhas |
| `pdfkit` | Geração de PDF das ordens de serviço |
| `dotenv` | Carregamento de variáveis de ambiente |
| `tsx` / `tsup` | Execução e build em TypeScript |

### 1.2 Scripts (`package.json`)

| Script | Comando | Descrição |
|---|---|---|
| `start:dev` | `tsx --env-file=.env src/server.ts` | Sobe o servidor em modo dev |
| `start:watch` | `tsx watch --env-file=.env src/server.ts` | Modo dev com watch/hot-reload |
| `dist` | `tsup src` | Compila o projeto para `dist/` |
| `start:dist` | `npm run dist && node dist/src/index.js` | Build + execução da versão compilada |

### 1.3 Arquitetura em camadas

O backend segue uma arquitetura em camadas bem definida, repetida de forma consistente em todos os módulos (clients, vehicles, parts, labor, users, os):

```
routes.ts  →  controllers/  →  services/  →  repositories/  →  PostgreSQL (pool)
                    ↓               ↓
                Models/         utils/http.ts (helpers de resposta HTTP)
```

- **`routes.ts`** — define todas as rotas e aplica o middleware `authToken` onde necessário.
- **`controllers/`** — recebe `Request`/`Response`, extrai parâmetros/body e delega para a service correspondente.
- **`services/`** — contém a regra de negócio, trata erros com `try/catch` e monta a resposta padronizada via `utils/http.ts`.
- **`repositories/`** — camada de acesso a dados; executa as queries SQL no `pool` do PostgreSQL e faz o mapeamento `snake_case` (banco) → `camelCase` (aplicação) via `AS "campo"` nas queries.
- **`Models/`** — interfaces TypeScript que representam as entidades e o formato padrão de resposta HTTP.
- **`middlewares/auth.ts`** — validação de JWT.
- **`config/db.ts`** — pool de conexão com o PostgreSQL.
- **`utils/http.ts`** — funções fábrica para respostas HTTP padronizadas (`ok`, `created`, `noContent`, `badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `internalServerError`).

### 1.4 Estrutura de pastas

```
backend/
├── package.json
├── tsconfig.json
├── postgre/
│   ├── dbCreate.sql       # schema do banco
│   └── dbInserts.sql      # dados de seed
└── src/
    ├── server.ts          # bootstrap do Express
    ├── routes.ts          # definição de todas as rotas
    ├── config/
    │   └── db.ts          # pool de conexão PostgreSQL
    ├── middlewares/
    │   └── auth.ts        # middleware authToken (JWT)
    ├── utils/
    │   └── http.ts        # helpers de resposta HTTP padronizada
    ├── Models/
    │   ├── httpModel.ts
    │   ├── jwtModel.ts
    │   ├── userModel.ts
    │   ├── clientModel.ts
    │   ├── vehicleModel.ts
    │   ├── partsModel.ts
    │   ├── laborModel.ts
    │   ├── OSModel.ts
    │   ├── partsOsModel.ts
    │   └── laborOsModel.ts
    ├── controllers/
    │   ├── usersControllers.ts
    │   ├── clientController.ts
    │   ├── vehicleController.ts
    │   ├── partsController.ts
    │   ├── laborController.ts
    │   └── osController.ts
    ├── services/
    │   ├── userServices.ts
    │   ├── clientService.ts
    │   ├── vehicleService.ts
    │   ├── partsService.ts
    │   ├── laborService.ts
    │   ├── osService.ts
    │   └── generatePdf.ts   # geração de PDF da OS (PDFKit)
    └── repositories/
        ├── userData.ts
        ├── clientData.ts
        ├── vehicleData.ts
        ├── partsData.ts
        ├── laborData.ts
        └── osData.ts
```

---

## 2. Bootstrap do servidor (`server.ts`)

```ts
app.use(express.static(path.join(__dirname, '../../frontend')));  // serve o frontend estático
app.use('/pdfs', express.static(path.join(__dirname, '../pdfs'))); // serve os PDFs gerados
app.use(express.json());
app.use('/', router);
app.get('/', (_req, res) => res.redirect('/html/home.html'));
app.listen(PORT, ...);
```

- Porta padrão: **3333** (variável `PORT`).
- Serve os arquivos estáticos do frontend (`../../frontend`) e os PDFs gerados (`../pdfs`).
- A rota raiz `/` redireciona para `/html/home.html`.
- Todo o roteamento da API é centralizado em `routes.ts`, montado em `/`.

---

## 3. Configuração / variáveis de ambiente

O projeto usa um arquivo `.env` (carregado via `tsx --env-file=.env`). Variáveis identificadas no código:

| Variável | Uso | Default no código |
|---|---|---|
| `PORT` | Porta do servidor Express | `3333` |
| `DB_HOST` | Host do PostgreSQL | `''` |
| `DB_PORT` | Porta do PostgreSQL | `30267` |
| `DB_NAME` | Nome do banco | `Ponto8WebApp` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `''` |
| `JWT_SECRET` | Segredo para assinar/verificar JWT (obrigatório — lança erro se ausente) | — |
| `COMPANY_LEGAL_NAME` | Razão social exibida no cabeçalho do PDF da OS | — |
| `COMPANY_CNPJ` | CNPJ exibido no cabeçalho do PDF da OS | — |
| `COMPANY_ADDRESS` | Endereço exibido no cabeçalho do PDF da OS | — |

`config/db.ts` cria um `Pool` do `pg` com `max: 10`, `idleTimeoutMillis: 30000` e `connectionTimeoutMillis: 2000`, e loga eventos de `connect`/`error`.

---

## 4. Autenticação (`middlewares/auth.ts` + módulo `users`)

### 4.1 Estratégia

- **Access token**: JWT assinado com `JWT_SECRET`, payload `{ id: userId }`, expira em **15 minutos**.
- **Refresh token**: string aleatória de 64 bytes (`crypto.randomBytes(64).toString('hex')`, 128 caracteres hex), armazenada na tabela `refresh_tokens`, expira em **7 dias**. É rotacionado a cada uso (o token antigo é deletado e um novo é emitido).
- Senhas são hasheadas com **bcrypt** (`hash`/`compare`), usando salt rounds aleatório entre 10 e 12.

### 4.2 Middleware `authToken`

Extrai o token do header `Authorization: Bearer <token>`, verifica com `jwt.verify` usando `JWT_SECRET`:
- Sem token → `401`.
- Token inválido/expirado → `401`.
- Válido → popula `req.user` com o payload decodificado e chama `next()`.

Esse middleware é aplicado em **todas as rotas**, exceto `/login` e `/refresh` (e note que `/register` também exige `authToken`, ou seja, só um usuário autenticado pode cadastrar outro).

### 4.3 Fluxo de autenticação

1. `POST /login` com `email`/`password` → valida credenciais → retorna `{ accessToken, refreshToken }`.
2. Cliente usa `accessToken` no header `Authorization` para chamar as rotas protegidas.
3. Quando o `accessToken` expira, `POST /refresh` com o `refreshToken` → retorna um novo par de tokens (rotação).
4. `POST /logout` com `refreshToken` → remove o refresh token do banco.

---

## 5. Modelo de dados (PostgreSQL)

Schema definido em `backend/postgre/dbCreate.sql`.

### 5.1 Diagrama de relacionamento (textual)

```
clients (1) ───< vehicles (N)
clients (1) ───< service_orders (N) >─── users (mechanic)
vehicles (1) ───< service_orders (N)
service_orders (1) ───< order_parts (N) >─── parts
service_orders (1) ───< order_labor (N) >─── labors
users (1) ───< refresh_tokens (N)
```

### 5.2 Tabelas

**`clients`**
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | SERIAL | PK |
| `name` | VARCHAR(100) | NOT NULL |
| `address` | VARCHAR(200) | NOT NULL |
| `phone` | BIGINT | NOT NULL |
| `cpf` | VARCHAR(14) | NOT NULL, UNIQUE |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE |

**`vehicles`**
| Coluna | Tipo | Restrições |
|---|---|---|
| `id_vehicle` | SERIAL | PK |
| `vehicle_model` | VARCHAR(60) | NOT NULL |
| `vehicle_brand` | VARCHAR(60) | NOT NULL |
| `year` | INT | NOT NULL |
| `chassi` | VARCHAR(17) | NOT NULL, UNIQUE |
| `plate` | VARCHAR(10) | NOT NULL, UNIQUE |
| `client_id` | INT | FK → `clients.id`, `ON DELETE CASCADE` |

**`parts`**
| Coluna | Tipo | Restrições |
|---|---|---|
| `id_part` | SERIAL | PK |
| `name_part` | VARCHAR(100) | NOT NULL |
| `amount` | INT | NOT NULL, DEFAULT 0 |
| `buy_value` | NUMERIC(10,2) | NOT NULL |
| `sale_value` | NUMERIC(10,2) | NOT NULL |

**`labors`** (catálogo de serviços)
| Coluna | Tipo | Restrições |
|---|---|---|
| `id_labor` | SERIAL | PK |
| `labor_name` | VARCHAR(100) | NOT NULL |

**`users`**
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | SERIAL | PK |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE |
| `password_hash` | VARCHAR(255) | NOT NULL |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**`refresh_tokens`**
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | SERIAL | PK |
| `user_id` | INT | FK → `users.id`, `ON DELETE CASCADE` |
| `token` | TEXT | NOT NULL, UNIQUE |
| `expires_at` | TIMESTAMP | NOT NULL |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**`service_orders`** (ordens de serviço / OS)
| Coluna | Tipo | Restrições |
|---|---|---|
| `id_so` | SERIAL | PK |
| `id_client` | INT | NOT NULL, FK → `clients.id` |
| `id_vehicle` | INT | NOT NULL, FK → `vehicles.id_vehicle` |
| `mechanic` | INT | NOT NULL, FK → `users.id` |
| `description` | TEXT | — |
| `total_price` | NUMERIC(10,2) | NOT NULL, DEFAULT 0 |
| `pdf_path` | VARCHAR(300) | — |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**`order_parts`** (peças aplicadas em uma OS)
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | SERIAL | PK |
| `id_so` | INT | NOT NULL, FK → `service_orders.id_so`, `ON DELETE CASCADE` |
| `id_part` | INT | NOT NULL, FK → `parts.id_part` |
| `amount` | INT | NOT NULL |
| `unit_price` | NUMERIC(10,2) | NOT NULL |

**`order_labor`** (serviços aplicados em uma OS)
| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | SERIAL | PK |
| `id_so` | INT | NOT NULL, FK → `service_orders.id_so`, `ON DELETE CASCADE` |
| `id_labor` | INT | NOT NULL, FK → `labors.id_labor` |
| `amount` | INT | NOT NULL, DEFAULT 1 |
| `unit_price` | NUMERIC(10,2) | NOT NULL |

> Observação: em `insertOL` (repositório de OS), `amount` é sempre gravado como `1` — a quantidade de mão de obra não é configurável via API atualmente.

### 5.3 Interfaces TypeScript (`Models/`)

```ts
// httpModel.ts — formato padrão de toda resposta interna das services
interface HttpResponse { status: number; body: any }

// userModel.ts
interface UserModel { id: number; name: string; email: string; passwordHash: string; createdAt?: Date }

// clientModel.ts
interface ClientModel { id: number; name: string; address: string; phone: string; cpf: string; email: string; vehicles?: VehicleModel[] }

// vehicleModel.ts
interface VehicleModel { idVehicle: number; vehicleModel: string; vehicleBrand: string; year: number; chassi: string; plate: string; cliendId: number }
// ⚠️ typo original no código-fonte: "cliendId" (deveria ser "clientId")

// partsModel.ts
interface PartsModel { idPart: number; namePart: string; amount: number; buyValue: number; saleValue: number }

// laborModel.ts
interface LaborModel { idLabor: number; laborName: string }

// OSModel.ts
interface OSModel { id: number; idClient: number; idVehicle: number; mechanic: number; description: string; totalPrice: number; pdfPath?: string; createdAt: Date }

// partsOsModel.ts
interface PartsOsModel { id: number; idSo: number; idPart: number; amount: number; unitPrice: number }

// laborOsModel.ts
interface LaborOsModel { id: number; idLabor: number; idSo: number; value: number }
```

---

## 6. Padrão de resposta HTTP (`utils/http.ts`)

Todas as services retornam um objeto `HttpResponse` (`{ status, body }`), consumido pelos controllers via `res.status(httpResponse.status).json(httpResponse.body)`.

| Helper | Status | Uso típico |
|---|---|---|
| `ok(data)` | 200 | Sucesso em GET/PATCH/DELETE |
| `created(data)` | 201 | Sucesso em POST (criação) |
| `noContent()` | 204 | Nenhum dado encontrado (ex.: lista vazia) |
| `badRequest()` | 400 | Falha de criação / dados inválidos |
| `unauthorized()` | 401 | Credenciais/token inválidos |
| `forbidden()` | 403 | Sem uso identificado nas rotas atuais |
| `notFound()` | 404 | Sem uso identificado nas rotas atuais |
| `conflict()` | 409 | Sem uso identificado nas rotas atuais |
| `internalServerError(error)` | 500 | Exceção não tratada (captura o `Error`) |

Todas as services seguem o mesmo padrão: `try { ... } catch (error) { console.error(error); return hr.internalServerError(error as Error) }`.

---

## 7. Referência completa da API

**Base URL:** `http://localhost:3333`
**Autenticação:** header `Authorization: Bearer <accessToken>` — obrigatório em todas as rotas marcadas com 🔒.

### 7.1 Usuários / Autenticação

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| POST | `/register` | 🔒 | Cria um novo usuário (nome, email, senha) |
| POST | `/login` | — | Autentica (`email`, `password`) → `{ accessToken, refreshToken }` |
| POST | `/refresh` | — | Rotaciona o refresh token → novo `{ accessToken, refreshToken }` |
| POST | `/logout` | — | Invalida o `refreshToken` informado |
| GET | `/users` | 🔒 | Lista todos os usuários (`id`, `name`, `email`) |

**Detalhes:**

- `POST /register`
  Body: `{ name, email, passwordHash, createdAt? }` (o campo `passwordHash` recebe a senha em texto puro, que é hasheada no service antes de salvar).
  → `201` com o usuário criado, ou `400` se falhar.

- `POST /login`
  Body: `{ email, password }`.
  → `200` `{ accessToken, refreshToken }`, ou `401` se credenciais inválidas.

- `POST /refresh`
  Body: `{ refreshToken }` (`400` se ausente).
  → `200` novo par de tokens, ou `401` se o token não existir/expirado.

- `POST /logout`
  Body: `{ refreshToken }` (`400` se ausente).
  → `200` `{ message: 'logout realizado' }`.

- `GET /users`
  → `200` lista de usuários, ou `204` se vazia.

### 7.2 Clientes

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/clients` | 🔒 | Lista todos os clientes |
| GET | `/clients/:id` | 🔒 | Busca cliente por id |
| POST | `/clients/post` | 🔒 | Cria um cliente |
| PATCH | `/clients/update/:id` | 🔒 | Atualiza campos de um cliente (parcial) |
| DELETE | `/clients/:id` | 🔒 | Remove um cliente |

Body de criação/atualização: `{ name, address, phone, cpf, email }` (todos opcionais no PATCH — apenas os campos enviados são atualizados, via montagem dinâmica de `SET`).

### 7.3 Veículos

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/vehicle` | 🔒 | Lista todos os veículos |
| GET | `/vehicle/:id` | 🔒 | Busca veículo por id |
| POST | `/vehicle/post` | 🔒 | Cria um veículo |
| PATCH | `/vehicle/update/:id` | 🔒 | Atualiza campos de um veículo (parcial) |
| DELETE | `/vehicle/:id` | 🔒 | Remove um veículo |

Body de criação: `{ vehicleModel, vehicleBrand, year, chassi, plate, cliendId }` (atenção ao nome de campo `cliendId`, com typo, herdado do `VehicleModel`).

### 7.4 Peças

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/parts` | 🔒 | Lista todas as peças |
| GET | `/parts/:id` | 🔒 | Busca peça por id |
| POST | `/parts/post` | 🔒 | Cria uma peça |
| PATCH | `/parts/update/:id` | 🔒 | Atualiza campos de uma peça (parcial) |
| DELETE | `/parts/:id` | 🔒 | Remove uma peça |

Body de criação: `{ namePart, amount, buyValue, saleValue }`.

### 7.5 Mão de obra / Serviços (catálogo)

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/labor` | 🔒 | Lista todos os serviços do catálogo |
| GET | `/labor/:id` | 🔒 | Busca serviço por id |
| POST | `/labor/post` | 🔒 | Cria um serviço |
| PATCH | `/labor/update/:id` | 🔒 | Atualiza o nome de um serviço |
| DELETE | `/labor/:id` | 🔒 | Remove um serviço |

Body de criação: `{ laborName }`.

### 7.6 Ordens de Serviço (OS)

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/os` | 🔒 | Lista todas as OS |
| GET | `/os/:id` | 🔒 | Busca OS por id |
| POST | `/os/post` | 🔒 | Cria uma OS |
| PATCH | `/os/update/:id` | 🔒 | Atualiza campos de uma OS (parcial) |
| PATCH | `/os/pdfPath/:id` | 🔒 | Atualiza o `pdfPath` de uma OS |
| DELETE | `/os/:id` | 🔒 | Remove uma OS |
| GET | `/os/:id/parts` | 🔒 | Lista as peças vinculadas a uma OS |
| GET | `/os/:id/labor` | 🔒 | Lista os serviços vinculados a uma OS |
| POST | `/os/:id/pdf` | 🔒 | Gera o PDF da OS e grava o caminho no banco |
| POST | `/os/:id/parts` | 🔒 | Vincula uma peça a uma OS |
| DELETE | `/os/:id/parts/:partId` | 🔒 | Remove uma peça de uma OS |
| POST | `/os/:id/labor` | 🔒 | Vincula um serviço a uma OS |
| DELETE | `/os/:id/labor/:laborId` | 🔒 | Remove um serviço de uma OS |

**Detalhes:**

- `POST /os/post`
  Body: `{ idClient, idVehicle, mechanic, description, totalPrice, createdAt }`.
  → `201` com a OS criada.

- `POST /os/:id/parts`
  Body: `{ idSo, idPart, amount, unitPrice }` → insere em `order_parts`.

- `POST /os/:id/labor`
  Body: `{ idSo, idLabor, value }` → insere em `order_labor` com `amount` fixo em `1` e `unit_price = value`.

- `POST /os/:id/pdf`
  Gera o PDF da ordem de serviço (ver seção 8), atualiza `pdf_path` no banco e retorna `{ path: <nomeDoArquivo> }`. Em caso de falha, retorna `500` com `{ message, error }`.

---

## 8. Geração de PDF da Ordem de Serviço (`services/generatePdf.ts`)

### 8.1 Fluxo (`gerarOsPdf(idOs)`)

1. Busca a OS pelo id (`findOSById`); lança erro se não existir.
2. Busca cliente e veículo em paralelo (`findClientById`, `findVehicleById`).
3. Busca peças (`findOpByIdSo`) e serviços (`findOlByIdSo`) vinculados à OS.
4. Resolve os detalhes de cada peça/serviço (`findPartById`, `selectLaborById`).
5. Monta o documento PDF com **PDFKit** (tamanho A4, margem 40) e salva em `backend/pdfs/OS_<id>_<nomeCliente>.pdf`.
6. Retorna o caminho absoluto do arquivo gerado.

### 8.2 Seções do documento

| Seção | Função | Conteúdo |
|---|---|---|
| Cabeçalho | `gerarCabecalho` | Logo (`frontend/img/logo.png`), nome da oficina, razão social/CNPJ/endereço (via env), número e data da OS |
| Dados de cliente/veículo | `gerarDadosClienteVeiculo` | Nome, CPF/CNPJ, endereço, telefone do cliente; marca/modelo, placa, chassi, ano do veículo |
| Tabela de peças | `gerarTabelaPecas` | Item, descrição, quantidade, valor unitário, valor total — com paginação automática |
| Tabela de serviços | `gerarTabelaServicos` | Idem, para mão de obra (quantidade sempre 1) |
| Totais | `gerarTotais` | Total de produtos, total de serviços, valor líquido |
| Laudo/termos | `gerarLaudoETermos` | Texto de observações da OS + termo de aceite do cliente |
| Assinaturas | `gerarAssinaturas` | Linhas de assinatura da oficina e do cliente |
| Rodapé | `gerarRodape` | Identificação do sistema gerador |

Helpers: `checarNovaPagina` (quebra de página quando o conteúdo ultrapassa y=760), `formatarData` (pt-BR), `formatarMoeda` (BRL).

O PDF é servido estaticamente pela rota `/pdfs` configurada em `server.ts`, apontando para `backend/pdfs/`.

> Nota de código: comentários `FIX:` no arquivo indicam correções aplicadas para garantir que `osId` seja usado (em vez de `os.id`, que vem `undefined` porque o alias SQL da OS é `idSo`) e que valores numéricos vindos do banco (`amount`, `unitPrice`, `value`) sejam convertidos com `Number(...)` antes de operações aritméticas.

---

## 9. Observações e pontos de atenção

- **Typo estrutural**: o campo de FK do veículo para o cliente se chama `cliendId` em `VehicleModel` (TypeScript), embora no banco a coluna seja `client_id` e o repositório mapeie corretamente para `clientId` nas queries de leitura — a inconsistência aparece na criação (`insertVehicle` usa `vehicle.cliendId`).
- **`/register` exige autenticação**: só é possível cadastrar um novo usuário estando logado (não há rota pública de "primeiro cadastro").
- **Sem validação de schema**: os controllers não validam o corpo da requisição (ex.: com Zod/Joi) além de checagens básicas de presença; o tratamento de erro depende majoritariamente do banco (constraints `NOT NULL`/`UNIQUE`) e do bloco `try/catch` das services.
- **Quantidade de mão de obra fixa**: `insertOL` sempre grava `amount = 1`, então a API não permite quantidades diferentes de 1 para itens de serviço.
- **Sem paginação**: todos os endpoints de listagem (`GET /clients`, `/vehicle`, `/parts`, `/labor`, `/os`, `/users`) retornam o conjunto completo, ordenado por id.