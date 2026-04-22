import { VehicleModel } from '../Models/vehicleModel';
import * as vd from '../repositories/vehicleData';
import * as hr from '../utils/http';

export const listVehicleService = async () => {
    try{
        const data = await vd.findVehicle();
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

export const getVehicleByIdService = async (id:number) => {
    try{
        const data = await vd.findVehicleById(id);
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

export const createVehicleService = async (vehicle:VehicleModel) => {
    try {
        const data = await vd.insertVehicle(vehicle);
        let response = null
        
        if(data) response = await hr.created(data);
        else response = await hr.badRequest();
        
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};

export const updateVehicleService = async (id:number, bodyValue:VehicleModel) => {
    try {
        const data = await vd.updateVehicle(id, bodyValue);
        const response = await hr.ok(data);
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);   
    }
};

export const deleteVehicleService = async (id:number) => {
    try {
        let response = null;
        await vd.deleteVehicle(id);
            
        response = await hr.ok({message: 'deleted'})
        return response;
    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
};