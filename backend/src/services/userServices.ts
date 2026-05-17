import { UserModel } from '../Models/userModel';
import * as ud from '../repositories/userData';
import * as hr from '../utils/http';
import * as jwt from 'jsonwebtoken';
import crypto, { randomInt } from 'crypto';
import { hash, compare } from 'bcrypt';

export const registerService = async (bodyValue:UserModel) => {
    try {
        const time = new Date();
        const randomSalt = randomInt(10, 12);
        const passwordHash = await hash(bodyValue.passwordHash, randomSalt);
        const data = await ud.registerUser(bodyValue, time, passwordHash);
        let response = null;

        if(data) response = await hr.created(data);
        else response = await hr.badRequest();

        return response;

    } catch (error) {
        console.error(error); 
        return hr.internalServerError(error as Error);
    }
}

export const loginService = async (email:string, password:string) => {
    try {
        const secret = process.env.JWT_SECRET;
        if(!secret) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');

        const data = await ud.loginUser(email);
        if(!data) return hr.unauthorized();
        const isValidPassword = await compare(password, data.passwordHash)
        if(!isValidPassword) return hr.unauthorized();

        const accessToken = jwt.sign({id: data.id}, secret, {expiresIn: '15m'}); // expira em 15 minutos
        const refreshToken = crypto.randomBytes(64).toString('hex');
        // cria um refreshtoken baseado em randomBytes (128 caracteres)
        // é possivel usar UUID, mas ele possui um padrão, que pode ser descoberto
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // expira em 7 dias

        await ud.saveRefreshToken(data.id, refreshToken, expiresAt);

        return hr.ok({accessToken, refreshToken});
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}

export const refreshService = async (token:string) => {
    try {
        const secret = process.env.JWT_SECRET;
        if(!secret) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');

        const stored = await ud.findRefreshToken(token);

        if(!stored) return hr.unauthorized();

        await ud.deleteRefreshToken(token);

        const newAccessToken = jwt.sign({id: stored.user_id}, secret, {expiresIn: '15m'});

        const newRefreshToken =  crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await ud.saveRefreshToken(stored.user_id, newRefreshToken, expiresAt);

        return hr.ok({accessToken: newAccessToken, refreshToken: newRefreshToken});
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}

export const logout = async (token:string) => {
    try {
        await ud.deleteRefreshToken(token);
        return hr.ok({message: 'logout realizado'});
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}