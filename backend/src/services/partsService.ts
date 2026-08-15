import { PartsModel } from '../Models/partsModel';
import * as pd from '../repositories/partsData';

export const listPartService = async () => {
    const data = await pd.findParts();
    if(!data) return null;
    return data;
};

export const getPartByIdService = async (id:number) => {
    const data = await pd.findPartById(id);
    if(!data) return null;
    return data;
};

export const createPartService = async (part:PartsModel) => {
    const data = await pd.insertPart(part);
    if(!data) return null;
    return data; 
};

export const updatePartService = async (id:number, bodyValue:PartsModel) => {
    const data = await pd.updatePart(id, bodyValue);
    if(!data) return null;
    return data;
};

export const deletePartService = async (id:number) => {
    const data = await pd.deletePart(id);  
    if(!data) return null;
    return data;
};