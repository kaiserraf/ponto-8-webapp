import { LaborModel } from "../Models/laborModel";
import * as ld from "../repositories/laborData";
import * as hr from '../utils/http';

export const getLaborsService = async () => {
    try {
        const data = await ld.selectLabors();
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const getLaborByIdService = async (id:number) => {
    try {
        const data = await ld.selectLaborById(id);
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const postLaborService = async (bodyValue:LaborModel) => {
    try {
        const data = await ld.postLabor(bodyValue);
        let response = null;

        if(data) response = await hr.created(data);
        else response = await hr.badRequest();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const updateLaborService = async (id:number, newName:string) => {
    try {
        const data = await ld.updateLabor(id, newName);
        const response = await hr.ok(data);
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const deleteLaborService = async (id:number) => {
    try {
        const data = await ld.deleteLabor(id);
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};