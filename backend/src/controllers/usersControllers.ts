import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as us from '../services/userServices';
import {Request, Response} from 'express';

export const register = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await us.registerService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
}

export const login = async (req:Request, res:Response) => {    
    try {
        const {email, password} = req.body;
        const response = await us.loginService(email, password);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
}

export const refresh = async (req:Request, res:Response) => {    
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) res.status(StatusCodes.BAD_REQUEST).json({message: 'Refresh token não fornecido'});
        const response = await us.refreshService(refreshToken);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
}

export const logout = async (req:Request, res:Response) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) res.status(400).json({message: 'Refresh token não fornecido'});
        const response = await us.logout(refreshToken);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const response = await us.getUsersService();
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
};