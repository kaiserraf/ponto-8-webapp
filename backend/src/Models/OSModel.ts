export interface OSModel {
    id: number,
    id_client: number,
    id_vehicle: number,
    mechanic: number,
    description: string,
    totalPrice: number,
    pdfPath?: string,
    createdAt: Date
}