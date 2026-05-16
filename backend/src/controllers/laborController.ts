import {Request, Response} from 'express';
import * as ls from '../services/laborService';
import { badRequest } from '../utils/http';
import {LaborModel} from '../Models/laborModel'

export const getLabors = async (req:Request, res:Response) => {
    const httpResponse = await ls.getLaborsService();
    res.status(httpResponse.status).json(httpResponse.body);
};

export const getLaborById = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse = await ls.getLaborByIdService(id);
    res.status(httpResponse.status).json(httpResponse.body);
};

export const postLabor = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await ls.postLaborService(bodyValue);
    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(response.status).json(response.body);
    }
};

export const updateLabor = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const newName = req.body;
    const httpResponse = await ls.updateLaborService(id, newName);
    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(response.status).json(response.body);
    }
};

export const deleteLabor = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse =  await ls.deleteLaborService(id);
    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(await response.status).json(response.body);
    }
};