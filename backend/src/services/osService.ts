import { OSModel } from '../Models/OSModel';
import { PartsOsModel } from '../Models/partsOsModel';
import * as osd from '../repositories/osData';
import * as hr from '../utils/http';

export const listOsService = async () => {
    try {
        const data = await osd.listOS();
        let response = null

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const getOsByIdService = async (id:number) => {
    try {
        const data = await osd.findOSById(id);
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const insertOsService = async (os: OSModel) => {
    try {
        const data = await osd.insertOS(os);
        let response = null;

        if(data) response = hr.created(data);
        else response = hr.badRequest();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}

export const updateOsService = async (id:number, bodyValue:OSModel) => {
    try {
        const data = await osd.updateOS(id, bodyValue);
        const response = await hr.ok(data);
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const deleteOsService = async (id:number) => {
    try {
        await osd.deleteOP(id);
        const response = await hr.ok({message: 'deleted'});

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const insertOrderPartsService = async (part:PartsOsModel) => {
    try {
        const data = await osd.insertOP(part); // adicionar conteudo aqui dentro
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};