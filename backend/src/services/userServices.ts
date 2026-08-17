import { UserModel } from '../Models/userModel';
import * as ud from '../repositories/userData';
import * as jwt from 'jsonwebtoken';
import * as crypt from '../utils/crypt';
import { randomBytes } from 'node:crypto';

const validJWTSecret = async () => {
    const jwtToken = process.env.JWT_SECRET;
    if(!jwtToken) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
    return jwtToken;
}

export const registerService = async (bodyValue:UserModel) => {
    const time = new Date();
    const passwordHash = await crypt.hashPassword(bodyValue.passwordHash);
    const data = await ud.registerUser(bodyValue, time, passwordHash);
    if(!data) return null;
    return data;
}

export const loginService = async (email:string, password:string) => {
    email = email.toLowerCase().trim();
    const secret = await validJWTSecret();

    const data = await ud.loginUser(email);
    if(!data) return null;
    const isValidPassword = await crypt.comparePassword(password, data.passwordHash);
    if(!isValidPassword) return null;

    const accessToken = jwt.sign({id: data.id}, secret, {expiresIn: '15m'});
    const refreshToken = randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    const save = await ud.saveRefreshToken(data.id, refreshToken, expiresAt);

    return {accessToken, refreshToken};
}

export const refreshService = async (token:string) => {
    const secret = await validJWTSecret();

    const stored = await ud.findRefreshToken(token);
    if(!stored) return null;

    await ud.deleteRefreshToken(token);

    const newAccessToken = jwt.sign({id: stored.user_id}, secret, {expiresIn: '15m'});
    const newRefreshToken =  randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await ud.saveRefreshToken(stored.user_id, newRefreshToken, expiresAt);
    return {accessToken: newAccessToken, refreshToken: newRefreshToken};
}

export const logout = async (token:string) => {
    const data = await ud.deleteRefreshToken(token);
    if(!data) return null;
    return data;
}

export const getUsersService = async () => {
    const data = await ud.findAllUsers();
    if(!data) return null;
    return data;
};