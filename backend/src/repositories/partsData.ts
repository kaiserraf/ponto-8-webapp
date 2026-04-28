import pool from "../config/db";
import { PartsModel } from "../Models/partsModel";

export const findParts = async () => {
    const result = await pool.query<PartsModel>(
        `SELECT * FROM parts ORDER BY id_part`
    );
    return result.rows;
};

export const findPartsByName = async (name:string):Promise<PartsModel | null> => {
    const result = await pool.query<PartsModel>(
        `SELECT * FROM parts WHERE name_part = $1`,
        [name]
    );
    return result.rows[0] ?? null;
};

export const insertPart = async (part:PartsModel) => {
    const result = await pool.query<PartsModel>(
        `INSERT INTO parts (name_part, amount, buy_value, sale_value)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [part.namePart, part.amount, part.buyValue, part.saleValue]
    );
    const p = result.rows[0];
    if(!p) throw new Error('Falha ao criar peça');
    return p;
};

export const updatePart = async (id:number, bodyValue:Partial<{
        namePart: string,
        amount: number,
        buyValue: number,
        saleValue: number
    }>
) => {
    const field: string[] = [];
    const value: unknown[] = [];
    let count = 1;

    if(bodyValue.namePart !== undefined){
        field.push(`name_part = $${count++}`);
        value.push(bodyValue.namePart);
    }
    if(bodyValue.amount !== undefined){
        field.push(`amount = $${count++}`);
        value.push(bodyValue.amount);
    }
    if(bodyValue.buyValue !== undefined){
        field.push(`buy_value = $${count++}`);
        value.push(bodyValue.buyValue);
    }
    if(bodyValue.saleValue !== undefined){
        field.push(`sale_value = $${count++}`);
        value.push(bodyValue.saleValue);
    }

    if(field.length === 0) return null;

    value.push(id);

    const result = await pool.query<PartsModel>(
        `UPDATE parts SET ${field.join(',')} WHERE id_part = $${count}
        RETURNING id_part, name_part, amount, buy_value, sale_value`,
        value
    );

    return result.rows[0] ?? null;
};

export const deletePart = async (id:number):Promise<PartsModel | null> => {
    const result = await pool.query<PartsModel>(
        `DELETE FROM parts
        WHERE id_part = $1
        RETURNING id_part, name_part, amount, buy_value, sale_value`,
        [id]
    );

    return result.rows[0] ?? null;
};
