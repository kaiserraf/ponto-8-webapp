export interface VehicleModel {
    idVehicle: number,
    vehicleModel: string,
    vehicleBrand: string,
    year: number,
    chassi: string,
    plate: string,
    clientId: number // FK -> referenciando cliente
}