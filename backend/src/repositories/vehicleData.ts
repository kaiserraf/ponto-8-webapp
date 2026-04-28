import pool from "../config/db";
import { VehicleModel } from "../Models/vehicleModel";

export const findVehicle = async () => {
    const result = await pool.query<VehicleModel>(
        `SELECT * FROM vehicles ORDER BY id_vehicle`
    );
    return result.rows;
};

export const findVehicleById = async (id:number):Promise<VehicleModel | null> => {
    const result = await pool.query<VehicleModel>(
        `SELECT * FROM vehicles WHERE id_vehicle = $1`,
        [id]
    );
    return result.rows[0] ?? null;
};

export const insertVehicle = async (vehicle:VehicleModel) => {
    const result = await pool.query<VehicleModel>(
        `INSERT INTO vehicles (
            vehicle_model, vehicle_brand,
            year, chassi, plate,
            client_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            vehicle.vehicleModel,
            vehicle.vehicleBrand,
            vehicle.year,
            vehicle.chassi,
            vehicle.plate,
            vehicle.cliendId
        ]
    );
    const v = result.rows[0];
    if(!v) throw new Error('Falha ao criar veiculo');
    return v;
};

export const updateVehicle = async (id:number, bodyValue:Partial<{
        vehicleModel: string,
        vehicleBrand: string,
        year: number,
        chassi: string,
        plate: string,
        cliendId: number
    }>
) => {
    const field: string[] = [];
    const value: unknown[] = [];
    let count = 1;

    if(bodyValue.vehicleModel !== undefined){
        field.push(`vehicle_model = $${count++}`);
        value.push(bodyValue.vehicleModel);
    }
    if(bodyValue.vehicleBrand !== undefined){
        field.push(`vehicle_brand = $${count++}`);
        value.push(bodyValue.vehicleBrand);
    }
    if(bodyValue.year !== undefined){
        field.push(`year = $${count++}`);
        value.push(bodyValue.year);
    }
    if(bodyValue.chassi !== undefined){
        field.push(`chassi = $${count++}`);
        value.push(bodyValue.chassi);
    }
    if(bodyValue.plate !== undefined){
        field.push(`plate = $${count++}`);
        value.push(bodyValue.plate);
    }
    if(bodyValue.cliendId !== undefined){
        field.push(`cliend_id = $${count++}`);
        value.push(bodyValue.cliendId);
    }

    if(field.length === 0) return null;

    value.push(id);

    const result = await pool.query<VehicleModel>(
        `UPDATE vehicles SET ${field.join(',')} WHERE id = $${count}
        RETURNING 
            id_vehicle, vehicle_model,
            vehicle_brand, year, chassi,
            plate, client_id`,
        value
    );

    return result.rows[0] ?? null;
};

export const deleteVehicle = async (id:number):Promise<VehicleModel | null> => {
    const result = await pool.query<VehicleModel>(
        `DELETE FROM vehicles
        WHERE id_vehicle = $1
        RETURNING 
            id_vehicle, vehicle_model,
            vehicle_brand, year, chassi,
            plate, client_id`,
        [id]
    );

    return result.rows[0] ?? null;
};