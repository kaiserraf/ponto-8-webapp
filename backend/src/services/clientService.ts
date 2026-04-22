import { ClientModel } from "../Models/clientModel";
import * as cd from "../repositories/clientData";
import * as hr from '../utils/http';

export const listClientService = async () => {
    try{
        const data = await cd.findClients();
        let response = null;
    
        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    }
    catch(error){
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}

export const getClientByNameService = async (name:string) => {
    try{
        const data = await cd.findClientsByName(name);
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();    

        return response;
    }
    catch(error){
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}

export const createClientService = async (client:ClientModel) => {
    try {
        const data = await cd.insertClient(client);
        let response = null;
        
        if(data){
            response = await hr.created(data);
        }else{
            response = await hr.badRequest();
        }
        
        return response;
        
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
    
}

export const updateClientService = async (id:number, bodyValue:ClientModel) => {   
    try {
        const data = await cd.updateClient(id, bodyValue);
        const response = await hr.ok(data);
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}

export const deleteClientService = async (id:number) => {
    try {
        let response = null;
        await cd.deleteClient(id);
    
        response = await hr.ok({message: 'deleted'})
        return response;
        
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
    
}