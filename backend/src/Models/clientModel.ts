import { VehicleModel } from "./vehicleModel"

export interface ClientModel {
    id: number, 
    name: string,
    address: string,
    phone: string,
    cpf: string,
    email: string,
    vehicles?: VehicleModel[]
}