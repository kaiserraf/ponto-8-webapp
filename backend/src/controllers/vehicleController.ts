import { Request, Response } from 'express';
import * as vs from '../services/vehicleService';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { VehicleModel } from '../Models/vehicleModel';


export const getVehicle = async (req:Request, res:Response) => {
    try {
        const response = await vs.listVehicleService();
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const getVehicleById = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const response = await vs.getVehicleByIdService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const postVehicle = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await vs.createVehicleService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const updateVehicle = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const bodyValue:VehicleModel = req.body;
        const response = await vs.updateVehicleService(id, bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const deleteVehicle = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const response = await vs.deleteVehicleService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};