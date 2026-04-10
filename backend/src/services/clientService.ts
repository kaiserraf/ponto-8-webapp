import * as cd from "../repositories/clientData";
import * as hr from '../utils/http';

export const listClient = async () => {
    const data = await cd.findClients();
    let response = null;
    if(data){
        response = await hr.ok(data);
    }else{
        response = await hr.noContent();
    }

    return response;
}