-- ver todas as tabelas que existem
SELECT table_name 
FROM information_schema.tables
WHERE table_schema='public'
AND table_type='BASE TABLE';

-- Select de tabelas 
SELECT * FROM users ORDER BY id;
SELECT * FROM vehicles ORDER BY id_vehicle;
SELECT * FROM clients ORDER BY id;

-- deleta todas as tabelas
DROP TABLE vehicles CASCADE;
DROP TABLE clients CASCADE;
DROP TABLE users CASCADE;
DROP TABLE refresh_tokens CASCADE;
DROP TABLE service_orders CASCADE;
DROP TABLE order_parts CASCADE;
DROP TABLE parts CASCADE;
DROP TABLE order_labor CASCADE;
DROP TABLE labors CASCADE;