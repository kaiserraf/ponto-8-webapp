import {Request, Response} from 'express';
import * as ls from '../services/laborService';
import { badRequest } from '../utils/http';

// obter todas as peças
export const getLabors = async (req:Request, res:Response) => {
    const httpResponse = await ls.getLaborsService(); // chama metodo da service
    res.status(httpResponse.status).json(httpResponse.body); // retorna status HTTP e JSON
};

// obter peça a partir de Id
export const getLaborById = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string); // pega id na url da rota
    const httpResponse = await ls.getLaborByIdService(id); // chama metodo da service passando id
    res.status(httpResponse.status).json(httpResponse.body); // retorna status HTTP e JSON
};

// inserir nova peça
export const postLabor = async (req:Request, res:Response) => {
    const bodyValue = req.body; // pega as informações passadas no corpo da requisição
    const httpResponse = await ls.postLaborService(bodyValue); // chama metodo da service passando body
    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body); // se conseguir inserir retorna sucesso
    else{
        const response = await badRequest(); // cria const para badRequest
        res.status(response.status).json(response.body); // retorna badRequest
    }
};

// editar peça
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

// excluir peça
export const deleteLabor = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse =  await ls.deleteLaborService(id);
    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(await response.status).json(response.body);
    }
};