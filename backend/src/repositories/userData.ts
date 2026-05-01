import { UserModel } from "../Models/userModel";
import pool from "../config/db";

export const registerUser = async (user:UserModel, time:Date):Promise<UserModel> => {
    const result = await pool.query<UserModel>(
        `INSERT INTO users (name, email, password_hash, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [user.name, user.email.toLowerCase().trim(), user.passwordHash, time]
    );

    const u = result.rows[0];
    if(!u) throw new Error('Falha ao criar usuario');
    return u;
};

export const loginUser = async (email:string):Promise<UserModel> => {
    const result = await pool.query<UserModel>(
        `SELECT id, email, password_hash AS "passwordHash" FROM users WHERE email = $1`,
        [email.toLowerCase().trim()]
    );
    return result.rows[0] ?? null;
};

export const saveRefreshToken = async (userId:number, token:string, expiresAt: Date) => {
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
         [userId, token, expiresAt]
    );
};

export const findRefreshToken = async (token:string) => {
    const result = await pool.query(
        `SELECT * FROM refresh_tokens
        WHERE token = $1 AND expires_at > NOW()`,
        [token]
    );
    return result.rows[0] ?? null;
};

export const deleteRefreshToken = async (token:string) => {
    await pool.query(
        `DELETE FROM refresh_tokens WHERE token = $1`,
        [token]
    );
};