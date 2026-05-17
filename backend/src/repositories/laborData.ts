import pool from "../config/db";
import { LaborModel } from "../Models/laborModel";

export const selectLabors = async ():Promise<LaborModel[]> => {
    const result = await pool.query<LaborModel>(
        `SELECT * FROM labor ORDER BY id_labor`
    );

    return result.rows
};

export const selectLaborById = async (idLabor:number):Promise<LaborModel | null> => {
    const result = await pool.query<LaborModel>(
        `SELECT * FROM labor WHERE id_labor = $1`, [idLabor]
    );

    return result.rows[0] ?? null;
};

export const postLabor = async (bodyValue:LaborModel):Promise<LaborModel> => {
    const result = await pool.query<LaborModel>(
        `INSERT INTO labor (labor_name)
        VALUES ($1)
        RETURNING *`, [bodyValue.labor]
    );
    const l = result.rows[0];
    if(!l) throw new Error('Falha ao criar Serviço');
    return l;
};

export const updateLabor = async (id:number, newName:string) => {
    const result = await pool.query<LaborModel>(
        `UPDATE labor
        SET labor_name = $1
        WHERE id_labor = $2
        RETURNING *`,
        [newName, id]
    );
    return result.rows[0] ?? null;
};

export const deleteLabor = async (id:number):Promise<LaborModel> => {
    const result = await pool.query<LaborModel>(
        `DELETE FROM labor
        WHERE id_labor = $1
        RETURNING *`,
        [id]
    );
    return result.rows[0] ?? null;
};