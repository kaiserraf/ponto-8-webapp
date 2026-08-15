import { UserModel } from '../Models/userModel';
import * as ud from '../repositories/userData';
import * as jwt from 'jsonwebtoken';
import crypto, { randomInt } from 'crypto';
import { hash, compare } from 'bcrypt';

const validJWTSecret = async () => {
    const jwtToken = process.env.JWT_SECRET;
    if(!jwtToken) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
    return jwtToken;
}

export const registerService = async (bodyValue:UserModel) => {
    const time = new Date();
    const randomSalt = randomInt(10, 12);
    const passwordHash = await hash(bodyValue.passwordHash, randomSalt);
    const data = await ud.registerUser(bodyValue, time, passwordHash);
    if(!data) return null;
    return data;
}

export const loginService = async (email:string, password:string) => {
    email = email.toLowerCase().trim();
    const secret = await validJWTSecret();

    const data = await ud.loginUser(email);
    if(!data) return null;
    const isValidPassword = await compare(password, data.passwordHash)
    if(!isValidPassword) return null;

    const accessToken = jwt.sign({id: data.id}, secret, {expiresIn: '15m'});
    const refreshToken = crypto.randomBytes(64).toString('hex');

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
    const newRefreshToken =  crypto.randomBytes(64).toString('hex');

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