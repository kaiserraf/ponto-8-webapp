import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'; 

declare global{
    namespace Express{
        interface Request{
            user?: string | jwt.JwtPayload;
        }
    }
}

export const authToken = async (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.header('authorization');
    const token = authHeader?.split(' ')[1];

    const secret = process.env.JWT_SECRET;
    if(!secret) throw new Error('JWT_SECRET não definido nas variáveis de ambiente');

    if(!token) return res.sendStatus(401);

    jwt.verify(token, secret, (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    });
};