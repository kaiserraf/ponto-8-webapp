import { UserModel } from "../Models/userModel";
import pool from "../config/db";

export const registerUser = async (user:UserModel, time:Date, passwordHash:string):Promise<UserModel> => {
    const result = await pool.query<UserModel>(
        `INSERT INTO users (name, email, password_hash, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING id AS "id", name AS "name", email AS "email", password_hash AS "passwordHash", created_at AS "createdAt"`,
        [user.name, user.email.toLowerCase().trim(), passwordHash, time]
    );

    const u = result.rows[0];
    if(!u) throw new Error('Falha ao criar usuario');
    return u;
};

export const loginUser = async (email:string):Promise<UserModel> => {
    const result = await pool.query<UserModel>(
        `SELECT id AS "id", email AS "email", password_hash AS "passwordHash" FROM users WHERE email = $1`,
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
        `SELECT user_id AS "userId", token AS "token", expires_at AS "expiresAt" FROM refresh_tokens
        WHERE token = $1 AND expires_at > NOW()`,
        [token]
    );
    return result.rows[0] ?? null;
};

export const deleteRefreshToken = async (token:string) => {
    const result = await pool.query(
        `DELETE FROM refresh_tokens WHERE token = $1`,
        [token]
    );
    return result.rows[0] ?? null;
};

export const findAllUsers = async (): Promise<Partial<UserModel>[]> => {
  const result = await pool.query(
    `SELECT id AS "id", name AS "name", email AS "email"
     FROM users ORDER BY id`
  );
  return result.rows;
};