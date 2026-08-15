import { ClientModel } from "../Models/clientModel";
import * as cd from "../repositories/clientData";

export const listClientService = async () => {
    const data = await cd.findClients();
    if(!data) return null;
    return data;
}

export const getClientByIdService = async (id:number) => {
    const data = await cd.findClientById(id);
    if(!data) return null;
    // fazer esquema para descriptografar dados do usuario
    return data;
}

export const createClientService = async (client:ClientModel) => {
    // fazer esquema para criptografar dados do usuario
    const data = await cd.insertClient(client);
    if(!data) return null; 
    return data; 
}

export const updateClientService = async (id:number, bodyValue:ClientModel) => {   
    // se tiver senha: criptografar
    const data = await cd.updateClient(id, bodyValue);
    if(!data) return null;
    return data;
}

export const deleteClientService = async (id:number) => {
    const data = cd.deleteClient(id);
    if(!data) return null;
    return data;
}