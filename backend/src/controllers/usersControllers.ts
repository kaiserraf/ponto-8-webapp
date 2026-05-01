import * as us from '../services/userServices';
import { badRequest } from '../utils/http';
import {Request, Response} from 'express';

export const register = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await us.registerService(bodyValue);

    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(response.status).json(response.body);
    }    
}

export const login = async (req:Request, res:Response) => {
    const {email, password} = req.body;
    const httpResponse = await us.loginService(email, password);
    res.status(httpResponse.status).json(httpResponse.body);
}

export const refresh = async (req:Request, res:Response) => {
    const { refreshToken } = req.body;

    if(!refreshToken){
        res.status(400).json({message: 'Refresh token não fornecido'});
        return;
    }

    const httpResponse = await us.refreshService(refreshToken);
    res.status(httpResponse.status).json(httpResponse.body);
}

export const logout = async (req:Request, res:Response) => {
    const { refreshToken } = req.body;

    if(!refreshToken){
        res.status(400).json({message: 'Refresh token não fornecido'});
        return;
    }

    const httpResponse = await us.logout(refreshToken);
    res.status(httpResponse.status).json(httpResponse.body);
}