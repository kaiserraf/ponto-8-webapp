export interface UserModel {
    id: number,
    name: string,
    email: string,
    passwordHash: string,
    createdAt?: Date
}