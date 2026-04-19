import { ClientModel } from "../Models/clientModel";
import * as cd from "../repositories/clientData";
import * as hr from '../utils/http';

export const listClientService = async () => {
    const data = await cd.findClients();
    let response = null;
    if(data){
        response = await hr.ok(data);
    }else{
        response = await hr.noContent();
    }

    return response;
}

export const getClientByNameService = async (name:string) => {
    const data = await cd.findClientsByName(name);
    let response = null;
    if(data){
        response = await hr.ok(data);
    }else{
        response = await hr.noContent();    
    }

    return response;
}

export const createClientService = async (client:ClientModel) => {
    const data = await cd.insertClient(client);
    let response = null;

    if(data){
        response = await hr.created(data);
    }else{
        response = await hr.badRequest();
    }
    
    return response;
}

export const updateClientService = async (id:number, bodyValue:ClientModel) => {
    
}

export const deleteClientService = async (id:number) => {
    let response = null;
    await cd.deleteClient(id);

    response = await hr.ok({message: 'deleted'})
    return response;
}