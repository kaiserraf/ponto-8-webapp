import {Request, Response} from 'express';
import * as ps from '../services/partsService';

export const getPart = async (req:Request, res:Response) => {
    const httpResponse = await ps.listPartService();
    res.status(httpResponse.status).json(httpResponse.body);
};

export const getPartById = async (req:Request, res:Response) => {};

export const postPart = async (req:Request, res:Response) => {};

export const updatePart = async (req:Request, res:Response) => {};

export const deletePart = async (req:Request, res:Response) => {};