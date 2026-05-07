import {Request, Response} from 'express';
import * as oss from '../services/osService';
import { badRequest } from '../utils/http';
import { OSModel } from '../Models/OSModel';


export const getOs = async (req:Request, res:Response) => {
    const httpResponse = await oss.listOsService();
    res.status(httpResponse.status).json(httpResponse.body);
};

export const getOsById = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse = await oss.getOsByIdService(id);
    res.status(httpResponse.status).json(httpResponse.body);
};

export const postOs = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await oss.insertOsService(bodyValue);

    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(response.status).json(response.body);   
    }
}

export const updateOs = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const bodyValue:OSModel = req.body; 
    const httpResponse = oss.updateOsService(id,bodyValue);
    res.status((await httpResponse).status).json((await httpResponse).body);
};

export const deleteOs = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse = await oss.deleteOsService(id);
    res.status(httpResponse.status).json(httpResponse.body);
};

export const updatePath = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const bodyValue:OSModel = req.body;
    const httpResponse = await oss.updatePathService(id,bodyValue);
    res.status(httpResponse.status).json(httpResponse.body);
};

export const insertOrderParts = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await oss.insertOrderPartsService(bodyValue);

    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(response.status).json(response.body);
    }
};
