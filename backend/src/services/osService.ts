import { LaborOsModel } from '../Models/laborOsModel';
import { OSModel } from '../Models/OSModel';
import { PartsOsModel } from '../Models/partsOsModel';
import * as osd from '../repositories/osData';
import * as hr from '../utils/http';
import { gerarOsPdf } from './generatePdf';

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

export const updatePathService = async (id:number, bodyValue:OSModel) => {
    try {
        const path = bodyValue.pdfPath;
        const data = await osd.updatePath(path, id);
        const response = await hr.ok(data);
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

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
        await osd.deleteOS(id);
        const response = await hr.ok({message: 'deleted'});

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const insertOrderPartsService = async (part:PartsOsModel) => {
    try {
        const data = await osd.insertOP(part);
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const deleteOrderPartsService = async (idSo:number, idPart:number) => {
    try {
        const data = await osd.deleteOP(idSo, idPart);
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}

export const insertOrderLaborService = async (labor:LaborOsModel) => {
    try {
        const data = await osd.insertOL(labor);
        let response = null

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const deleteOrderLaborService = async (idSo:number, idLabor:number) => {
    try {
        const data = await osd.deleteOL(idSo, idLabor);
        let response = null;

        if(data) response = await hr.ok(data);
        else response = await hr.noContent();

        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const getOrderPartsService = async (idSo: number) => {
    try {
        const data = await osd.findOpByIdSo(idSo);
        if (data) return hr.ok(data);
        return hr.noContent();
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const getOrderLaborService = async (idSo: number) => {
    try {
        const data = await osd.findOlByIdSo(idSo);
        if (data) return hr.ok(data);
        return hr.noContent();
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const generatePdfService = async (idSo: number) => {
    try {
        const caminho = await gerarOsPdf(idSo);
        const nomeArquivo = caminho.replace(/\\/g, '/').split('/').pop();
        const pdfPath = `/pdfs/${nomeArquivo}`;
        await osd.updatePath(pdfPath, idSo);
        const data = await osd.findOSById(idSo);
        return hr.ok(data);
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};