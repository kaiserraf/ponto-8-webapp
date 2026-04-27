import { UserModel } from '../Models/userModel';
import * as ud from '../repositories/userData';
import * as hr from '../utils/http';

export const registerService = async (bodyValue:UserModel) => {
    try {
        const time = new Date();
        const data = await ud.registerUser(bodyValue, time);
        let response = null;

        if(data) response = await hr.created(data);
        else response = await hr.badRequest();

        return response;

    } catch (error) {
        console.error(error);
        return hr.internalServerError(error as Error);
    }
}