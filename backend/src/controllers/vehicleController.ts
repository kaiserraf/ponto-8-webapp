import { Request, Response } from 'express';
import * as vs from '../services/vehicleService';
import { badRequest } from '../utils/http';
import { VehicleModel } from '../Models/vehicleModel';


export const getVehicle = async (req:Request, res:Response) => {
    const httpResponse = await vs.listVehicleService();
    res.status(httpResponse.status).json(httpResponse.body);
};

export const getVehicleById = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
        const httpResponse = await vs.getVehicleByIdService(id);
        res.status(httpResponse.status).json(httpResponse.body);
};

export const postVehicle = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await vs.createVehicleService(bodyValue);
        
    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(response.status).json(response.body);
    }
};

export const updateVehicle = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const bodyValue:VehicleModel = req.body;
    const httpResponse = await vs.updateVehicleService(id, bodyValue);
    res.status(httpResponse.status).json(httpResponse.body);
};

export const deleteVehicle = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse = await vs.deleteVehicleService(id);
    res.status(httpResponse.status).json(httpResponse.body);
};



