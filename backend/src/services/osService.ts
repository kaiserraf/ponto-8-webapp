import { LaborOsModel } from '../Models/laborOsModel';
import { OSModel } from '../Models/OSModel';
import { PartsOsModel } from '../Models/partsOsModel';
import * as osd from '../repositories/osData';


export const listOsService = async () => {
    const data = await osd.listOS();
    if(!data) return null;
    return data;
};

export const getOsByIdService = async (id:number) => {
    const data = await osd.findOSById(id);
    if(!data) return null;
    return data;
};

export const insertOsService = async (os: OSModel) => {
    const data = await osd.insertOS(os);
    if(!data) return null;
    return data;
}

export const updatePathService = async (id:number, bodyValue:OSModel) => {
    const path = bodyValue.pdfPath;
    const data = await osd.updatePath(path, id);
    if(!data) return null;
    return data;
};

export const updateOsService = async (id:number, bodyValue:OSModel) => {
    const data = await osd.updateOS(id, bodyValue);
    if(!data) return null;
    return data;
};

export const deleteOsService = async (id:number) => {
    const data = await osd.deleteOS(id);
    if(!data) return null;
    return data;
};

export const insertOrderPartsService = async (part:PartsOsModel) => {
    const data = await osd.insertOP(part);
    if(!data) return null;
    return data;
};

export const deleteOrderPartsService = async (idSo:number, idPart:number) => {
    const data = await osd.deleteOP(idSo, idPart);
    if(!data) return null;
    return data;
}

export const insertOrderLaborService = async (labor:LaborOsModel) => {
    const data = await osd.insertOL(labor);
    if(!data) return null;
    return data;;
};

export const deleteOrderLaborService = async (idSo:number, idLabor:number) => {
    const data = await osd.deleteOL(idSo, idLabor);
    if(!data) return null;
    return data;
};

export const getOrderPartsService = async (idSo: number) => {
    const data = await osd.findOpByIdSo(idSo);
    if(!data) return null;
    return data;
};

export const getOrderLaborService = async (idSo: number) => {
    const data = await osd.findOlByIdSo(idSo);
    if(!data) return null;
    return data;
};