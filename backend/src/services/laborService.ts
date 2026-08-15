import { LaborModel } from "../Models/laborModel";
import * as ld from "../repositories/laborData";

export const getLaborsService = async () => {
    const data = await ld.selectLabors();
    if(!data) return null;
    return data;
};

export const getLaborByIdService = async (id:number) => {
    const data = await ld.selectLaborById(id);
    if(!data) return null;
    return data;
};

export const postLaborService = async (bodyValue:LaborModel) => {
    const data = await ld.postLabor(bodyValue);
    if(!data) return null;
    return data;
};

export const updateLaborService = async (id:number, newName:string) => {
    const data = await ld.updateLabor(id, newName);
    if(!data) return null;
    return data;
};

export const deleteLaborService = async (id:number) => {
    const data = await ld.deleteLabor(id);
    if(!data) return null;
    return data;
};