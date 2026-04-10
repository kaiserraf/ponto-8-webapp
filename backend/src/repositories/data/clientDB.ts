import { ClientModel } from "../../Models/clientModel";

const database: ClientModel[] = [
    {
        id: 1,
        name: "João Silva",
        address: "Rua das Flores, 123 - Curitiba/PR",
        phone: 41999991111,
        cpf: "111.222.333-44",
        email: "joao.silva@email.com",
        vehicles: [
            { idVehicle: 1, vehicleModel: "Civic", vehicleBrand: "Honda", year: 2021, chassi: "9BWZZZ377VT004251", plate: "ABC-1234", cliendId: 1 },
            { idVehicle: 2, vehicleModel: "HRV", vehicleBrand: "Honda", year: 2022, chassi: "9BWZZZ377VT004252", plate: "DEF-5678", cliendId: 1 },
        ]
    },
    {
        id: 2,
        name: "Maria Oliveira",
        address: "Av. Batel, 456 - Curitiba/PR",
        phone: 41999992222,
        cpf: "222.333.444-55",
        email: "maria.oliveira@email.com",
        vehicles: [
            { idVehicle: 3, vehicleModel: "Corolla", vehicleBrand: "Toyota", year: 2020, chassi: "9BWZZZ377VT004253", plate: "GHI-9012", cliendId: 2 },
        ]
    },
    {
        id: 3,
        name: "Carlos Souza",
        address: "Rua XV de Novembro, 789 - Londrina/PR",
        phone: 43999993333,
        cpf: "333.444.555-66",
        email: "carlos.souza@email.com",
        vehicles: [
            { idVehicle: 4, vehicleModel: "Hilux", vehicleBrand: "Toyota", year: 2023, chassi: "9BWZZZ377VT004254", plate: "JKL-3456", cliendId: 3 },
            { idVehicle: 5, vehicleModel: "Onix", vehicleBrand: "Chevrolet", year: 2021, chassi: "9BWZZZ377VT004255", plate: "MNO-7890", cliendId: 3 },
        ]
    },
    {
        id: 4,
        name: "Ana Costa",
        address: "Rua Marechal Deodoro, 321 - Maringá/PR",
        phone: 44999994444,
        cpf: "444.555.666-77",
        email: "ana.costa@email.com",
        vehicles: [
            { idVehicle: 6, vehicleModel: "Tracker", vehicleBrand: "Chevrolet", year: 2022, chassi: "9BWZZZ377VT004256", plate: "PQR-1234", cliendId: 4 },
        ]
    },
    {
        id: 5,
        name: "Pedro Mendes",
        address: "Av. Sete de Setembro, 654 - Ponta Grossa/PR",
        phone: 42999995555,
        cpf: "555.666.777-88",
        email: "pedro.mendes@email.com",
        vehicles: [
            { idVehicle: 7, vehicleModel: "Compass", vehicleBrand: "Jeep", year: 2023, chassi: "9BWZZZ377VT004257", plate: "STU-5678", cliendId: 5 },
            { idVehicle: 8, vehicleModel: "Renegade", vehicleBrand: "Jeep", year: 2020, chassi: "9BWZZZ377VT004258", plate: "VWX-9012", cliendId: 5 },
        ]
    },
    {
        id: 6,
        name: "Fernanda Lima",
        address: "Rua Imaculada Conceição, 987 - Curitiba/PR",
        phone: 41999996666,
        cpf: "666.777.888-99",
        email: "fernanda.lima@email.com",
        vehicles: [
            { idVehicle: 9, vehicleModel: "Gol", vehicleBrand: "Volkswagen", year: 2019, chassi: "9BWZZZ377VT004259", plate: "YZA-3456", cliendId: 6 },
            { idVehicle: 10, vehicleModel: "T-Cross", vehicleBrand: "Volkswagen", year: 2022, chassi: "9BWZZZ377VT004260", plate: "BCD-7890", cliendId: 6 },
        ]
    },
    {
        id: 7,
        name: "Ricardo Alves",
        address: "Av. Iguaçu, 159 - Foz do Iguaçu/PR",
        phone: 45999997777,
        cpf: "777.888.999-00",
        email: "ricardo.alves@email.com",
        vehicles: [
            { idVehicle: 11, vehicleModel: "Pulse", vehicleBrand: "Fiat", year: 2023, chassi: "9BWZZZ377VT004261", plate: "EFG-1234", cliendId: 7 },
        ]
    },
    {
        id: 8,
        name: "Juliana Martins",
        address: "Rua Emiliano Perneta, 753 - Curitiba/PR",
        phone: 41999998888,
        cpf: "888.999.000-11",
        email: "juliana.martins@email.com",
        vehicles: [
            { idVehicle: 12, vehicleModel: "Fastback", vehicleBrand: "Fiat", year: 2021, chassi: "9BWZZZ377VT004262", plate: "HIJ-5678", cliendId: 8 },
        ]
    },
];

export default database;