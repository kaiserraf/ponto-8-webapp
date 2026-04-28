import { UserModel } from '../Models/userModel';
import * as ud from '../repositories/userData';
import * as hr from '../utils/http';
import { authToken } from '../middlewares/auth';
import * as jwt from 'jsonwebtoken';

export const registerService = async (bodyValue:UserModel) => {
    try {
        const time = new Date();
        const data = await ud.registerUser(bodyValue, time);
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
        let response = null;
        const secret = process.env.JWT_SECRET;
        if(!secret) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');

        const data = await ud.loginUser(email);
        
        if(!data) return hr.unauthorized();
        if(!(email === data.email && password === data.passwordHash)) return hr.unauthorized();

        const token = jwt.sign({id: data.id}, secret, {expiresIn: '1h'});
        response = hr.ok(token);

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}