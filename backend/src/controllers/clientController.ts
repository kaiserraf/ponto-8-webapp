import {Request, Response} from 'express';
import * as cs from '../services/clientService';
import { badRequest } from '../utils/http';

// listar cliente
export const getClient = async (req:Request, res:Response) => {
    const httpResponse = await cs.listClientService();
    res.status(httpResponse.status).json(httpResponse.body);
};
export const getClientByName = async (req:Request, res:Response) => {
    const name = req.params.name as string;
    const httpResponse = await cs.getClientByNameService(name);
    res.status(httpResponse.status).json(httpResponse.body);
};

// cadastrar cliente
export const postClient = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await cs.createClientService(bodyValue);

    if(httpResponse){
        res.status(httpResponse.status).json(httpResponse.body);
    }else{
        const response = await badRequest();
        res.status(response.status).json(response.body);
    }
}
/*
// atulizar Cliente
export const updateClient = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse = await cs.updateClientService(id);
    // res.status(httpResponse.status).json(httpResponse.body);
}*/

// deletar cliente
export const deleteClient = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    const httpResponse = await cs.deleteClientService(id);
    res.status(httpResponse.status).json(httpResponse.body);
}