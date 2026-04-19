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
        `SELECT id, name, address, phone, cpf, email FROM clients WHERE name = $1`,
        [name]
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

// atualizar cliente
export const updateClient = async (id:number, bodyValue:Partial<{
    name: string,
    address: string,
    phone: string
    cpf: string,
    email: string
    }>
) => {
    const field: string[] = [];
    const value: unknown[] = [];
    let count = 1;

    if(bodyValue.name !== undefined){
        field.push(`name = $${count++}`);
        value.push(bodyValue.name);
    }
    if(bodyValue.address !== undefined){
        field.push(`address = $${count++}`);
        value.push(bodyValue.address);
    }
    if(bodyValue.phone !== undefined){
        field.push(`phone = $${count++}`);
        value.push(bodyValue.phone);
    }
    if(bodyValue.cpf !== undefined){
        field.push(`cpf = $${count++}`);
        value.push(bodyValue.cpf);
    }
    if(bodyValue.email !== undefined){
        field.push(`email = $${count++}`);
        value.push(bodyValue.email);
    }

    if(field.length === 0) return null;

    value.push(id);

    const result = await pool.query<ClientModel>(
        `UPDATE client SET ${field.join(',')} WHERE id $${count} RETURNING id, name, address, phone, cpf, email`,
        value
    );
    
    return result;
}

// deletar cliente
export const deleteClient = async (id:number): Promise<ClientModel | null> => {
    const result = await pool.query<ClientModel>(
        `DELETE FROM clients
        WHERE id = $1
        RETURNING id, name, address, phone, cpf, email`,
        [id]
    );

    return result.rows[0] ?? null;
}
