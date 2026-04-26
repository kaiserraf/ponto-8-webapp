# Documentação do Projeto: Ponto 8 WebApp - Sprint 1

## 1. Visão Geral
Esta documentação descreve as entregas da **Sprint 1** do projeto **Ponto 8 WebApp**, um sistema de gestão para oficinas automotivas. O objetivo principal desta etapa foi estabelecer a fundação técnica da aplicação, implementando o CRUD (Create, Read, Update, Delete) essencial para o funcionamento do negócio e uma interface de usuário moderna.

## 2. Escopo da Sprint 1
Nesta sprint, foram priorizados os módulos fundamentais para o controle operacional da oficina:
* **Gestão de Clientes**: Cadastro e manutenção de dados pessoais e de contato.
* **Gestão de Veículos**: Registro de frota associada aos clientes.
* **Gestão de Estoque (Peças)**: Controle de inventário com valores de compra e venda.
* **Dashboard Inicial**: Visão geral quantitativa do sistema.

## 3. Arquitetura Técnica

### Backend (Node.js + TypeScript)
A API foi estruturada seguindo o padrão de camadas para garantir escalabilidade e manutenção:
* **Models**: Definição das interfaces e tipos de dados.
* **Controllers**: Intermediação entre as requisições HTTP e a lógica de negócio.
* **Services**: Implementação das regras de negócio.
* **Repositories**: Abstração da camada de dados utilizando PostgreSQL.

### Banco de Dados (PostgreSQL)
O esquema relacional foi projetado para suportar integridade referencial:
* **Tabela `clients`**: Armazena nome, endereço, telefone, CPF e e-mail.
* **Tabela `vehicles`**: Armazena modelo, marca, ano, chassi e placa, com chave estrangeira vinculada a um cliente.
* **Tabela `parts`**: Armazena descrição, quantidade em estoque, preço de custo e preço de venda.

### Frontend (Modern UI)
Desenvolvido com foco em usabilidade e estética, utilizando (90% por IA):
* **HTML5/CSS3**: Layout responsivo com uma barra lateral de navegação e esquema de cores escuro (dark mode).
* **JavaScript (ES6+)**: Consumo assíncrono da API para atualização de dados sem recarregamento de página.

## 4. Endpoints Implementados

| Módulo | Endpoint | Método | Descrição |
| :--- | :--- | :--- | :--- |
| **Clientes** | `/clients` | GET | Lista todos os clientes. |
| | `/clients/post` | POST | Cadastra um novo cliente. |
| | `/clients/update/:id` | PATCH | Atualiza dados de um cliente. |
| | `/clients/:id` | DELETE | Remove um cliente do sistema. |
| **Veículos** | `/vehicle` | GET | Lista todos os veículos. |
| | `/vehicle/post` | POST | Cadastra um veículo para um cliente. |
| | `/vehicle/update/:id` | PATCH | Atualiza informações do veículo. |
| **Peças** | `/parts` | GET | Lista o inventário de peças. |
| | `/parts/post` | POST | Adiciona nova peça ao estoque. |

## 5. Destaques da Entrega
* **Interface Intuitiva**: O frontend conta com um Dashboard que exibe cards de estatísticas em tempo real (total de clientes, veículos e unidades em estoque).
* **Relacionamento de Dados**: Implementação de `ON DELETE CASCADE` na tabela de veículos, garantindo que a exclusão de um cliente remova automaticamente seus veículos vinculados.
* **Segurança de Tipos**: Uso de TypeScript em todo o backend para reduzir erros em tempo de execução.

---
*Documento gerado como registro da conclusão da Sprint 1 - Abril de 2026.*