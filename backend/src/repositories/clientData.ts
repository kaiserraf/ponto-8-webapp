import pool from "../config/db";
import { ClientModel } from "../Models/clientModel";

// todos os clientes
export const findClients = async ():Promise<ClientModel[]> => {
    const result = await pool.query<ClientModel>(
        `SELECT id, name, address, phone, cpf, email FROM clients ORDER BY id`
    );
    return result.rows;
}

// encontrar cliente pelo nome
export const findClientsByName = async (name:string):Promise<ClientModel | null> => {
    const result = await pool.query<ClientModel>(
        `SELECT id, name, address, phone, cpf, email FROM clients WHERE name = $1`
        // [name]
    );
    return result.rows[0] ?? null;
}

// criar cliente
export const insertClient = async (client:ClientModel):Promise<ClientModel> => {
    const result = await pool.query<ClientModel>(
        `INSERT INTO clients (name, address, phone, cpf, email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
         [client.name, client.address, client.phone, client.cpf, client.email]
    );
    const c = result.rows[0];
    if(!c) throw new Error('Falha ao criar cliente');
    return c;
}

