import { VehicleModel } from '../Models/vehicleModel';
import * as vd from '../repositories/vehicleData';
import * as crypto from '../utils/crypt';

export const listVehicleService = async () => {
    const data = await vd.findVehicle();
    if(!data) return null;

    const decrypt = await Promise.all(
        data.map(async (vehicle) => ({
            ...vehicle,
            plate: await crypto.decrypt(vehicle.plate),
            chassi: await crypto.decrypt(vehicle.chassi),
        }))
    );

    return decrypt;
};

export const getVehicleByIdService = async (id:number) => {
    const data = await vd.findVehicleById(id);
    if(!data) return null;

    data.chassi = await crypto.decrypt(data.chassi);
    data.plate = await crypto.decrypt(data.plate);

    return data;
};

export const createVehicleService = async (vehicle:VehicleModel) => {
    vehicle.chassi = await crypto.encrypt(vehicle.chassi);
    vehicle.plate = await crypto.encrypt(vehicle.plate);
    
    const data = await vd.insertVehicle(vehicle);
    if(!data) return null;
    return data;
};

export const updateVehicleService = async (id:number, vehicle:VehicleModel) => {
    if(vehicle.chassi != undefined) vehicle.chassi = await crypto.encrypt(vehicle.chassi)
    if(vehicle.plate != undefined) vehicle.plate = await crypto.encrypt(vehicle.plate)
    
    const data = await vd.updateVehicle(id, vehicle);
    if(!data) return null;
    return data;
};

export const deleteVehicleService = async (id:number) => {
    const data = await vd.deleteVehicle(id);    
    if(!data) return null;
    return data;
};