import { PartsModel } from '../Models/partsModel';
import * as pd from '../repositories/partsData';
import * as hr from '../utils/http';
import { HttpResponse } from '../Models/httpModel';

export const listPartService = async () => {
    try{
        const data = await pd.findParts();
        let response = null;

        if(data) response = await hr.ok(data); 
        else response = await hr.noContent();

        return response;
    }
    catch(error){
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const getPartByNameService = async (name:string) => {
    try{
        const data = await pd.findPartsByName(name);
        let response = null;
        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    }
    catch(error){
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const createPartService = async (part:PartsModel) => {
    try {
        const data = await pd.insertPart(part);
        let response = null
    
        if(data) response = await hr.created(data);
        else response = await hr.badRequest();
    
        return response;
        
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
    
};

export const updatePartService = async (id:number, bodyValue:PartsModel) => {
    try {
        const data = await pd.updatePart(id, bodyValue);
        const response = await hr.ok(data);
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const deletePartService = async (id:number) => {
    try {
        let response = null;
        await pd.deletePart(id);
        
        response = await hr.ok({message: 'deleted'})
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};