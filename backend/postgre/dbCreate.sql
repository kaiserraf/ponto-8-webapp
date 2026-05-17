--  Schema PostgreSQL — Sistema de Oficina

-- Tabela de clientes
CREATE TABLE clients (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(100)  NOT NULL,
    address   VARCHAR(200)  NOT NULL,
    phone     BIGINT        NOT NULL,
    cpf       VARCHAR(14)   NOT NULL UNIQUE,
    email     VARCHAR(100)  NOT NULL UNIQUE
);

-- Tabela de veículos
CREATE TABLE vehicles (
    id_vehicle    SERIAL PRIMARY KEY,
    vehicle_model VARCHAR(60)  NOT NULL,
    vehicle_brand VARCHAR(60)  NOT NULL,
    year          INT          NOT NULL,
    chassi        VARCHAR(17)  NOT NULL UNIQUE,
    plate         VARCHAR(10)  NOT NULL UNIQUE,
    client_id     INT          NOT NULL,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabela de peças
CREATE TABLE parts (
    id_part    SERIAL PRIMARY KEY,
    name_part  VARCHAR(100)   NOT NULL,
    amount     INT            NOT NULL DEFAULT 0,
    buy_value  NUMERIC(10, 2) NOT NULL,
    sale_value NUMERIC(10, 2) NOT NULL
);

-- Tabela de usuários do sistema
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT          NOT NULL UNIQUE,
    expires_at  TIMESTAMP     NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ordens de serviço
CREATE TABLE service_orders (
    id_so        SERIAL PRIMARY KEY,
    id_client    INT            NOT NULL REFERENCES clients(id),
    id_vehicle   INT            NOT NULL REFERENCES vehicles(id_vehicle),
    mechanic     INT   NOT NULL REFERENCES users(id),
    description  TEXT,
    total_price  NUMERIC(10,2)  NOT NULL DEFAULT 0,
    pdf_path     VARCHAR(300),
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE order_parts (
    id           SERIAL PRIMARY KEY,
    id_so        INT            NOT NULL REFERENCES service_orders(id_so) ON DELETE CASCADE,
    id_part      INT            NOT NULL REFERENCES parts(id_part),
    amount       INT            NOT NULL,
    unit_price   NUMERIC(10,2)  NOT NULL
);


-- Catálogo de serviços da oficina
CREATE TABLE labors (
    id_labor    SERIAL PRIMARY KEY,
    labor_name  VARCHAR(100) NOT NULL
);

-- Tabela de ligação: serviços vinculados a uma OS
CREATE TABLE order_labor (
    id          SERIAL PRIMARY KEY,
    id_so       INT            NOT NULL REFERENCES service_orders(id_so) ON DELETE CASCADE,
    id_labor    INT            NOT NULL REFERENCES labors(id_labor),
    amount      INT            NOT NULL DEFAULT 1,
    unit_price  NUMERIC(10,2)  NOT NULL
);
