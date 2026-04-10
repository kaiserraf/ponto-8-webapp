import { VehicleModel } from "./vehicleModel"

export interface ClientModel {
    id: number, 
    name: string,
    address: string,
    phone: number
    cpf: string,
    email: string,
    vehicle?: VehicleModel[]
}