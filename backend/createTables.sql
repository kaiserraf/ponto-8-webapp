USE ponto8webapp;

CREATE TABLE client (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100),
    address VARCHAR(500),
    phone VARCHAR(15),
    cpf VARCHAR(11),
    email VARCHAR(50)
);

CREATE TABLE car (
    id INT PRIMARY KEY IDENTITY(1,1),
    model VARCHAR(50),
    brand VARCHAR(50),
    year INT,
    chassi VARCHAR(17),
    plate VARCHAR(7),
    fk_client_id INT  -- FK aqui, no lado "muitos"
);

ALTER TABLE car ADD CONSTRAINT FK_car_client
    FOREIGN KEY (fk_client_id)
    REFERENCES client (id)