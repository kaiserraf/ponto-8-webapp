import pool from "../config/db";
import { PartsModel } from "../Models/partsModel";

export const findParts = async () => {
    const result = await pool.query<PartsModel>(
        `SELECT id_part, name_part, amount, buy_value, sale_value
        FROM parts ORDER BY id_part`
    );
    return result.rows;
};

export const findPartsById = async () => {};

export const insertPart = async () => {};

export const updatePart = async () => {}; // partial

export const deletePart = async () => {};
