export interface OSModel {
    id: number,
    idClient: number,
    idVehicle: number,
    mechanic: number,
    description: string,
    totalPrice: number,
    pdfPath?: string,
    createdAt: Date
}