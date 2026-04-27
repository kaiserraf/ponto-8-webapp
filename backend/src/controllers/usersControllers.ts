import * as us from '../services/userServices';
import { badRequest } from '../utils/http';

// cadastrar usuario
export const register = async (req:Request, res:Response) => {
    const bodyValue = req.body;
    const httpResponse = await us.registerService(bodyValue);

    if(httpResponse) res.status(httpResponse.status).json(httpResponse.body);
    else{
        const response = await badRequest();
        res.status(httpResponse.status).json(httpResponse.body);
    }
}

// login de usuario
export const login = async (req:Request, res:Response) => {
    
}