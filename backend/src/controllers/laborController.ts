import {Request, Response} from 'express';
import * as ls from '../services/laborService';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getLabors = async (req:Request, res:Response) => {
    try {
        const response = await ls.getLaborsService();
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
    
};

export const getLaborById = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string,);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({ message: "ID invalido" });
        const response = await ls.getLaborByIdService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
    
};

export const postLabor = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await ls.postLaborService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const updateLabor = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({ message: "ID invalido" });
        const newName = req.body;
        const response = await ls.updateLaborService(id, newName);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const deleteLabor = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({ message: "ID invalido" });
        const response =  await ls.deleteLaborService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};