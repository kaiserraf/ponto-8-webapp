import {Request, Response} from 'express';
import * as oss from '../services/osService';
import { OSModel } from '../Models/OSModel';
import { gerarOsPdf } from '../services/generatePdf';
import * as path from 'path';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';


export const getOs = async (req:Request, res:Response) => {
    try {
        const response = await oss.listOsService();
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const getOsById = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const response = await oss.getOsByIdService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const postOs = async (req:Request, res:Response) => {  
    try {
        const bodyValue = req.body;
        const response = await oss.insertOsService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
}

export const updateOs = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
        const bodyValue:OSModel = req.body; 
        const response = await oss.updateOsService(id,bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const deleteOs = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const response = await oss.deleteOsService(id);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const updatePath = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const bodyValue:OSModel = req.body;
        const response = await oss.updatePathService(id,bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const insertOrderParts = async (req:Request, res:Response) => {
    
    try {
        const bodyValue = req.body;
        const response = await oss.insertOrderPartsService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const deleteOrderParts = async (req:Request, res:Response) => {
    
    try {
        const idSo = parseInt(req.params.id as string);
        const idPart = parseInt(req.params.partId as string);
        const response = await oss.deleteOrderPartsService(idSo, idPart);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
}

export const insertOrderLabor = async (req:Request, res:Response) => {
    try {
        const bodyValue = req.body;
        const response = await oss.insertOrderLaborService(bodyValue);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const deleteOrderLabor = async (req:Request, res:Response) => {
    try {
        const idSo = parseInt(req.params.id as string);
        const idLabor = parseInt(req.params.laborId as string);
        const response = await oss.deleteOrderLaborService(idSo, idLabor);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const getOrderParts = async (req: Request, res: Response) => {
    
    try {
        const idSo = parseInt(req.params.id as string);
        const response = await oss.getOrderPartsService(idSo);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const getOrderLabor = async (req: Request, res: Response) => {
    
    try {
        const idSo = parseInt(req.params.id as string);
        const response = await oss.getOrderLaborService(idSo);
        if(!response) res.status(StatusCodes.NO_CONTENT).send();
        res.status(StatusCodes.OK).json(response);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
    }
};

export const generatePdf = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if(isNaN(id)) res.status(StatusCodes.BAD_REQUEST).json({message: "ID invalido"});
    const caminhoArquivo = await gerarOsPdf(id);
    const nomeArquivo = path.basename(caminhoArquivo);
    const response = await oss.updatePathService(id, { pdfPath: nomeArquivo } as any);
    if(!response) res.status(StatusCodes.NO_CONTENT).send();
    res.status(StatusCodes.OK).json({ path: nomeArquivo });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        });
  }
};