import { ClientModel } from "../Models/clientModel";
import * as cd from "../repositories/clientData";
import * as crypto from '../utils/crypt';

export const listClientService = async () => {
    const data = await cd.findClients();
    if(!data) return null;
    
    const decrypt = await Promise.all(
        data.map(async (client) => ({
            ...client,
            phone: await crypto.decrypt(client.phone),
            cpf: await crypto.decrypt(client.cpf),
            address: await crypto.decrypt(client.address),
            email: await crypto.decrypt(client.email),
        }))
    );

    return decrypt;
}

export const getClientByIdService = async (id:number) => {
    const data = await cd.findClientById(id);
    if(!data) return null;

    data.address = await crypto.decrypt(data.address);
    data.cpf = await crypto.decrypt(data.cpf);
    data.phone = await crypto.decrypt(data.phone);
    data.email = await crypto.decrypt(data.email);

    return data;
}

export const createClientService = async (cl:ClientModel) => {
    cl.address = await crypto.encrypt(cl.address);
    cl.cpf = await crypto.encrypt(cl.cpf);
    cl.phone = await crypto.encrypt(cl.phone);
    cl.email = await crypto.encrypt(cl.email);

    const data = await cd.insertClient(cl);
    if(!data) return null; 
    return data; 
}

export const updateClientService = async (id:number, cl:ClientModel) => {   
    if(cl.address != undefined) cl.address = await crypto.encrypt(cl.address);
    if(cl.cpf != undefined) cl.cpf = await crypto.encrypt(cl.cpf);
    if(cl.phone != undefined) cl.phone = await crypto.encrypt(cl.phone);
    if(cl.email != undefined) cl.email = await crypto.encrypt(cl.email);

    const data = await cd.updateClient(id, cl);
    if(!data) return null;
    return data;
}

export const deleteClientService = async (id:number) => {
    const data = cd.deleteClient(id);
    if(!data) return null;
    return data;
}