import { UserModel } from "../Models/userModel";
import pool from "../config/db";

export const registerUser = async (user:UserModel, time:Date):Promise<UserModel> => {
    const result = await pool.query<UserModel>(
        `INSERT INTO users (name, email, pasword_hash, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *`
    );

    const u = result.rows[0];
    if(!u) throw new Error('Falha ao criar usuario');
    return u;
}