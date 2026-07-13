import {Request, Response} from 'express';
import * as cs from '../services/clientService';
import { badRequest } from '../utils/http';
import { ClientModel } from '../Models/clientModel';

// controller para obter todos os clientes
export const getClient = async (req:Request, res:Response) => {
    const httpResponse = await cs.listClientService(); // chama o metodo da service de listar todos os clientes
    res.status(httpResponse.status).json(httpResponse.body); // retorna status HTTP e JSON  
};

// controller para obter clientes pelo id
export const getClientById = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string); // pega a id na url da rota
    const httpResponse = await cs.getClientByIdService(id); // chama metodo da service passando id como parametro
    res.status(httpResponse.status).json(httpResponse.body); // retorna status HTTP e JSON
};

// controller para inserir novo cliente
export const postClient = async (req:Request, res:Response) => {
    const bodyValue = req.body; // pega as informações passadas no body
    const httpResponse = await cs.createClientService(bodyValue); // chama metodo da service passando a body como parametro

    if(httpResponse){ // se httpResponse tiver conteudo
        res.status(httpResponse.status).json(httpResponse.body); // retorna status HTTP e JSON de sucesso 
    }else{ // se httpResponse não tiver conteudo
        const response = await badRequest(); // cria constante de badRequest
        res.status(response.status).json(response.body); // retorna status HTTP e JSON de badRequest
    }
}

// controller para atualizar cliente pelo id
export const updateClient = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string); // pega id passado na url da rota
    const bodyValue:ClientModel = req.body; // pega as informações passadas no body
    const httpResponse = await cs.updateClientService(id, bodyValue); // chama metodo da service passando id e body como parametro
    res.status(httpResponse.status).json(httpResponse.body); // retorna status HTTP e JSON
}

export const deleteClient = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string); // pega id passado na url da rota
    const httpResponse = await cs.deleteClientService(id); // chama metodo da service passando id como parametro
    res.status(httpResponse.status).json(httpResponse.body); // retorna status HTTP e JSON
}