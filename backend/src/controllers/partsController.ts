import {Request, Response} from 'express';
import * as ps from '../services/partsService';
import { badRequest } from '../utils/http';
import { PartsModel } from '../Models/partsModel';

export const getPart = async (req:Request, res:Response) => {
    const httpResponse = await ps.listPartService();
    res.status(httpResponse.status).json(httpResponse.body);
};

export const getPartByName = async (req:Request, res:Response) => {
    const name = req.params.name as string;
    const httpResponse = await ps.getPartByNameService(name);
    res.status(httpResponse.status).json(httpResponse.body);
};

export const postPart = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await ps.createPartService(bodyValue);
    
    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(response.status).json(response.body);
    }
};

export const updatePart = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const bodyValue:PartsModel = req.body;
    const httpResponse = await ps.updatePartService(id, bodyValue);
    res.status(httpResponse.status).json(httpResponse.body);
};

export const deletePart = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse = await ps.deletePartService(id);
    res.status(httpResponse.status).json(httpResponse.body);
};