import {Request, Response} from 'express';
import * as cs from '../services/clientService';

// listar cliente
export const getClient = async (req:Request, res:Response) => {
    const httpResponse = await cs.listClient();
    res.status(httpResponse.status).json(httpResponse.body);
};

export const getClientById = async (req:Request, res:Response) => {
    
}

// cadastrar cliente
export const postClient = async (req:Request, res:Response) => {
    
}

// deletar cliente
export const deleteClient = async (req:Request, res:Response) => {
    
}

// atulizar Cliente
export const updateClient = async (req:Request, res:Response) => {
    
}