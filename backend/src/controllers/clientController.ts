import {Request, Response} from 'express';
import * as cs from '../services/clientService';
import { ClientModel } from '../Models/clientModel';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getClient = async (req:Request, res:Response) => {
    try {
        const response = await cs.listClientService();
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const getClientById = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const response = await cs.getClientByIdService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const postClient = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await cs.createClientService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
        
}

export const updateClient = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const bodyValue:ClientModel = req.body;
        const response = await cs.updateClientService(id, bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
}

export const deleteClient = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const response = await cs.deleteClientService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
    
}