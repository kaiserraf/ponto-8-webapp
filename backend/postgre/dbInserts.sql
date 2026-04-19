--  Inserts — Clientes

INSERT INTO clients (name, address, phone, cpf, email) VALUES
('João Silva',      'Rua das Flores, 123 - Curitiba/PR',          41999991111, '111.222.333-44', 'joao.silva@email.com'),
('Maria Oliveira',  'Av. Batel, 456 - Curitiba/PR',               41999992222, '222.333.444-55', 'maria.oliveira@email.com'),
('Carlos Souza',    'Rua XV de Novembro, 789 - Londrina/PR',       43999993333, '333.444.555-66', 'carlos.souza@email.com'),
('Ana Costa',       'Rua Marechal Deodoro, 321 - Maringá/PR',     44999994444, '444.555.666-77', 'ana.costa@email.com'),
('Pedro Mendes',    'Av. Sete de Setembro, 654 - Ponta Grossa/PR', 42999995555, '555.666.777-88', 'pedro.mendes@email.com'),
('Fernanda Lima',   'Rua Imaculada Conceição, 987 - Curitiba/PR', 41999996666, '666.777.888-99', 'fernanda.lima@email.com'),
('Ricardo Alves',   'Av. Iguaçu, 159 - Foz do Iguaçu/PR',        45999997777, '777.888.999-00', 'ricardo.alves@email.com'),
('Juliana Martins', 'Rua Emiliano Perneta, 753 - Curitiba/PR',    41999998888, '888.999.000-11', 'juliana.martins@email.com');

--  Inserts — Veículos

INSERT INTO vehicles (vehicle_model, vehicle_brand, year, chassi, plate, client_id) VALUES
('Civic',     'Honda',      2021, '9BWZZZ377VT004251', 'ABC-1234', 1),
('HRV',       'Honda',      2022, '9BWZZZ377VT004252', 'DEF-5678', 1),
('Corolla',   'Toyota',     2020, '9BWZZZ377VT004253', 'GHI-9012', 2),
('Hilux',     'Toyota',     2023, '9BWZZZ377VT004254', 'JKL-3456', 3),
('Onix',      'Chevrolet',  2021, '9BWZZZ377VT004255', 'MNO-7890', 3),
('Tracker',   'Chevrolet',  2022, '9BWZZZ377VT004256', 'PQR-1234', 4),
('Compass',   'Jeep',       2023, '9BWZZZ377VT004257', 'STU-5678', 5),
('Renegade',  'Jeep',       2020, '9BWZZZ377VT004258', 'VWX-9012', 5),
('Gol',       'Volkswagen', 2019, '9BWZZZ377VT004259', 'YZA-3456', 6),
('T-Cross',   'Volkswagen', 2022, '9BWZZZ377VT004260', 'BCD-7890', 6),
('Pulse',     'Fiat',       2023, '9BWZZZ377VT004261', 'EFG-1234', 7),
('Fastback',  'Fiat',       2021, '9BWZZZ377VT004262', 'HIJ-5678', 8);

--  Inserts — Peças

INSERT INTO parts (name_part, amount, buy_value, sale_value) VALUES
('Filtro de óleo',           50,  12.50,  28.90),
('Filtro de ar',             40,   8.00,  19.90),
('Vela de ignição',         100,   6.50,  15.90),
('Pastilha de freio diant.',  30,  45.00,  95.00),
('Pastilha de freio tras.',   30,  38.00,  82.00),
('Correia dentada',           20,  55.00, 120.00),
('Amortecedor dianteiro',     15, 180.00, 380.00),
('Amortecedor traseiro',      15, 160.00, 340.00),
('Bateria 60Ah',              10, 280.00, 520.00),
('Óleo motor 5W30 (1L)',     200,  22.00,  48.00),
('Fluido de freio DOT4',      60,  14.00,  32.00),
('Rolamento de roda',         25,  75.00, 160.00);
