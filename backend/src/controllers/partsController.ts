import {Request, Response} from 'express';
import * as ps from '../services/partsService';
import { PartsModel } from '../Models/partsModel';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getPart = async (req:Request, res:Response) => {
    try {
        const response = await ps.listPartService();
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const getPartById = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const response = await ps.getPartByIdService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
};

export const postPart = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await ps.createPartService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
};

export const updatePart = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const bodyValue:PartsModel = req.body;
        const response = await ps.updatePartService(id, bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
};

export const deletePart = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const response = await ps.deletePartService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }); 
    }
};