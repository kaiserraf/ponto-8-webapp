export interface VehicleModel {
    idVehicle: number,
    vehicleModel: string,
    vehicleBrand: string,
    year: number,
    chassi: string,
    plate: string,
    cliendId: number // FK -> referenciando cliente
}