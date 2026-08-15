import { VehicleModel } from '../Models/vehicleModel';
import * as vd from '../repositories/vehicleData';

export const listVehicleService = async () => {
    const data = await vd.findVehicle();
    if(!data) return null;
    return data;
};

export const getVehicleByIdService = async (id:number) => {
    const data = await vd.findVehicleById(id);
    if(!data) return null;
    return data;
};

export const createVehicleService = async (vehicle:VehicleModel) => {
    const data = await vd.insertVehicle(vehicle);
    if(!data) return null;
    return data;
};

export const updateVehicleService = async (id:number, bodyValue:VehicleModel) => {
    const data = await vd.updateVehicle(id, bodyValue);
    if(!data) return null;
    return data;
};

export const deleteVehicleService = async (id:number) => {
    const data = await vd.deleteVehicle(id);    
    if(!data) return null;
    return data;
};