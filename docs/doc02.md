# Documentação do Projeto: Ponto 8 WebApp - Sprint 2

## 1. Visão Geral

Esta documentação descreve as entregas da **Sprint 2** do projeto **Ponto 8 WebApp**, dando continuidade à fundação estabelecida na Sprint 1. O foco desta etapa foi a implementação de um sistema de **autenticação completo**, a entrega de endpoints faltantes nos módulos existentes, a criação de uma **camada de frontend profissional** com módulos JavaScript reutilizáveis, e a introdução de uma tela de login/cadastro dedicada.

---

## 2. Escopo da Sprint 2

As seguintes áreas foram desenvolvidas ou expandidas nesta sprint:

- **Sistema de Autenticação (JWT + Refresh Token)**: Registro, login, renovação de token e logout.
- **Proteção de Rotas**: Middleware de autenticação aplicado a todos os endpoints de negócio.
- **Endpoints Faltantes**: Completude do CRUD de Veículos e Peças com os métodos `DELETE`.
- **Frontend Modular**: Separação da lógica em arquivos JS independentes (`api.js`, `ui.js`, `authGuard.js`).
- **Tela de Autenticação**: Página `index.html` com formulários de login e registro integrados.
- **Melhorias de UX**: Busca local em tempo real, indicador de estoque baixo, modal de confirmação de exclusão e sistema de toasts.

---

## 3. Novas Funcionalidades

### 3.1 Sistema de Autenticação

O sistema de autenticação foi implementado do zero, cobrindo todo o ciclo de vida de uma sessão de usuário.

**Banco de Dados:**

Duas novas tabelas foram adicionadas ao schema PostgreSQL:

| Tabela | Propósito |
| :--- | :--- |
| `users` | Armazena nome, e-mail e hash da senha dos usuários do sistema. |
| `refresh_tokens` | Armazena os refresh tokens ativos, com vínculo ao usuário e data de expiração. |

**Fluxo de Autenticação:**

1. O usuário realiza o **registro** enviando nome, e-mail e senha. As credenciais são persistidas na tabela `users`.
2. No **login**, o sistema valida as credenciais e emite dois tokens:
   - **Access Token (JWT)**: expira em **15 minutos**, assinado com `JWT_SECRET`.
   - **Refresh Token**: string criptograficamente aleatória de 128 caracteres (`crypto.randomBytes(64)`), expira em **7 dias**, persistida no banco.
3. O **refresh** consome o refresh token atual, valida sua existência e validade no banco, e emite um novo par de tokens (rotação de refresh token).
4. O **logout** apaga o refresh token do banco, invalidando a sessão.

> **Nota de segurança:** O refresh token é gerado com `crypto.randomBytes` ao invés de UUID para evitar padrões previsíveis. A rotação garante que tokens comprometidos sejam invalidados no primeiro uso legítimo.

---

### 3.2 Middleware de Autenticação

Foi criado o arquivo `src/middlewares/auth.ts` com o guard `authToken`, que intercepta todas as rotas protegidas. O middleware:

- Lê o header `Authorization: Bearer <token>`.
- Verifica e decodifica o JWT usando a variável de ambiente `JWT_SECRET`.
- Retorna `401 Unauthorized` se o token estiver ausente, expirado ou inválido.
- Injeta o payload do usuário em `req.user` para uso nos controllers.

Todas as rotas de negócio (`/clients`, `/parts`, `/vehicle`) agora exigem um access token válido.

---

### 3.3 Novos Endpoints

#### Autenticação (rotas públicas — sem `authToken`)

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/register` | POST | Cadastra um novo usuário no sistema. |
| `/login` | POST | Autentica o usuário e retorna `accessToken` + `refreshToken`. |
| `/refresh` | POST | Renova o par de tokens a partir de um refresh token válido. |
| `/logout` | POST | Invalida o refresh token e encerra a sessão. |

#### Veículos (completado)

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/vehicle/:id` | DELETE | Remove um veículo pelo ID. *(ausente na Sprint 1)* |

#### Clientes (completado)

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/clients/:name` | GET | Filtra clientes pelo nome. *(presente mas não funcional na Sprint 1)* |

---

## 4. Arquitetura Frontend

O frontend passou de scripts inline isolados para uma arquitetura modular com três arquivos JavaScript compartilhados, importados como ES Modules (`type="module"`).

### 4.1 `frontend/js/api.js` — Camada de Acesso ao Backend

Centraliza todas as chamadas HTTP. Nenhuma página faz `fetch` diretamente.

**Responsabilidades:**
- Lê o JWT do `localStorage` e injeta o header `Authorization: Bearer <token>` automaticamente em toda requisição.
- Em caso de `401`, limpa o token e redireciona para `/index.html`.
- Normaliza a resposta em `{ data, ok, status }` para tratamento uniforme nas páginas.

**Funções exportadas:**

| Grupo | Funções |
| :--- | :--- |
| Clientes | `getClients`, `getClientByName`, `createClient`, `updateClient`, `deleteClient` |
| Peças | `getParts`, `getPartByName`, `createPart`, `updatePart`, `deletePart` |
| Veículos | `getVehicles`, `getVehicleById`, `createVehicle`, `updateVehicle`, `deleteVehicle` |

---

### 4.2 `frontend/js/ui.js` — Utilitários de Interface

Componentes de UI reutilizáveis compartilhados entre todas as páginas.

| Função | Descrição |
| :--- | :--- |
| `toast(message, type, duration)` | Exibe uma notificação flutuante (`success` ou `error`) com auto-remoção. |
| `openModal(overlayId)` | Abre um modal pelo ID do overlay. |
| `closeModal(overlayId)` | Fecha um modal pelo ID do overlay. |
| `bindModalOverlayClose(overlayId)` | Fecha o modal ao clicar fora da caixa interna. |
| `setLoading(container, show)` | Exibe ou remove o spinner de carregamento em um container. |
| `serializeForm(form, omitEmpty)` | Serializa um formulário em objeto plano, com opção de omitir campos vazios (útil para `PATCH`). |
| `fillForm(form, data)` | Preenche os inputs de um formulário com um objeto de dados. |
| `clearForm(form)` | Limpa todos os campos do formulário. |

---

### 4.3 `frontend/js/authGuard.js` — Proteção de Páginas

Executado no topo de cada página protegida. Se não houver token no `localStorage`, redireciona imediatamente para `/index.html` antes que qualquer conteúdo seja carregado.

Exporta também `getToken()` e `logout()`, este último responsável por limpar o token e redirecionar para a tela de login.

---

## 5. Tela de Autenticação (`index.html`)

A página inicial do sistema foi refeita como uma tela de autenticação dedicada, substituindo o redirecionamento direto para o dashboard. Destaques:

- **Tab switcher** com transição suave entre os modos "Entrar" e "Cadastrar".
- **Formulário de login** com feedback de estado de carregamento no botão (spinner inline) e mensagens de erro/sucesso.
- **Formulário de registro** que, em caso de sucesso, exibe confirmação e redireciona automaticamente para a aba de login após 1,5 segundos.
- **Redirecionamento automático**: Se o usuário já possuir um token salvo, é enviado diretamente para `html/home.html`.
- Layout centralizado com gradiente radial sutil utilizando a paleta amarelo/preto do sistema.

---

## 6. Melhorias de UX nas Páginas de Listagem

### Busca em Tempo Real
Todas as páginas de listagem (Clientes, Veículos, Peças) passaram a ter filtro local instantâneo pelo campo de busca, sem novas requisições ao backend.

### Indicador de Estoque Baixo (`listParts.html`)
Na página de Peças, itens com quantidade inferior a 10 unidades são destacados com um chip vermelho, sinalizando necessidade de reposição.

### Modal de Confirmação de Exclusão
O botão "Remover" em todas as listagens agora abre um modal de confirmação estilizado (`.confirm-overlay`) com o nome do item a ser removido, substituindo o `window.confirm` nativo do browser.

### Seletor de Cliente no Cadastro de Veículos
O formulário de criação e edição de veículos carrega dinamicamente a lista de clientes do backend e popula um `<select>`, evitando que o usuário precise digitar o ID manualmente.

### Dashboard com Dados Reais
O Dashboard passou a buscar os dados dos três módulos em paralelo (`Promise.all`) e exibe o total de unidades em estoque como um quarto card de estatística, além das contagens de clientes, veículos e peças.

---

## 7. Tabela de Endpoints Completa (Sprint 1 + Sprint 2)

| Módulo | Endpoint | Método | Auth | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| **Auth** | `/register` | POST | ✗ | Cadastra usuário. |
| | `/login` | POST | ✗ | Autentica e emite tokens. |
| | `/refresh` | POST | ✗ | Renova par de tokens. |
| | `/logout` | POST | ✗ | Invalida refresh token. |
| **Clientes** | `/clients` | GET | ✓ | Lista todos os clientes. |
| | `/clients/:name` | GET | ✓ | Busca cliente pelo nome. |
| | `/clients/post` | POST | ✓ | Cadastra novo cliente. |
| | `/clients/update/:id` | PATCH | ✓ | Atualiza dados do cliente. |
| | `/clients/:id` | DELETE | ✓ | Remove cliente. |
| **Veículos** | `/vehicle` | GET | ✓ | Lista todos os veículos. |
| | `/vehicle/:id` | GET | ✓ | Busca veículo pelo ID. |
| | `/vehicle/post` | POST | ✓ | Cadastra novo veículo. |
| | `/vehicle/update/:id` | PATCH | ✓ | Atualiza dados do veículo. |
| | `/vehicle/:id` | DELETE | ✓ | Remove veículo. |
| **Peças** | `/parts` | GET | ✓ | Lista o inventário. |
| | `/parts/:name` | GET | ✓ | Busca peça pelo nome. |
| | `/parts/post` | POST | ✓ | Adiciona peça ao estoque. |
| | `/parts/update/:id` | PATCH | ✓ | Atualiza dados da peça. |
| | `/parts/:id` | DELETE | ✓ | Remove peça. |

---

## 8. Dependências Utilizadas

| Pacote | Versão | Uso |
| :--- | :--- | :--- |
| `express` | ^5.2.1 | Framework HTTP do servidor. |
| `jsonwebtoken` | ^9.0.3 | Geração e verificação de JWTs. |
| `pg` | ^8.20.0 | Driver PostgreSQL (pool de conexões). |
| `dotenv` | ^17.4.1 | Leitura de variáveis de ambiente (`.env`). |
| `tsx` | ^4.7.1 | Execução de TypeScript em desenvolvimento. |
| `tsup` | ^8.0.2 | Build para produção. |

---

## 9. Variáveis de Ambiente Necessárias

| Variável | Descrição |
| :--- | :--- |
| `PORT` | Porta em que o servidor Express escuta. |
| `JWT_SECRET` | Chave secreta para assinar e verificar JWTs. |
| `DB_HOST` | Host do servidor PostgreSQL. |
| `DB_PORT` | Porta do PostgreSQL (padrão: `5432`). |
| `DB_NAME` | Nome do banco de dados. |
| `DB_USER` | Usuário do banco de dados. |
| `DB_PASSWORD` | Senha do banco de dados. |

---

*Documento gerado como registro da conclusão da Sprint 2 — Maio de 2026.*