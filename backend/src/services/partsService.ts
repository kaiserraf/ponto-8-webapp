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

export const getPartByIdService = async () => {};

export const createPartService = async () => {};

export const updatePartService = async () => {};

export const deletePartService = async () => {};