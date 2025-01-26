import { Request, Response, NextFunction, RequestHandler } from 'express';
import { findByKey } from '../services/apiKey.service';

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"
};

// Middleware function with proper type definition
export const checkApiKey = async (req: any, res: any, next: any) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();

        if (!key) {
            return res.status(403).json({
                message: 'Forbidden: Missing API Key',
            });
        }

        const objKey = await findByKey(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden: Invalid API Key',
            });
        }

        req.objectKey = objKey;
        return next();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};


export const checkPermissions = (req: any, res: any, next: any) => {
    const { objectKey } = req;

    if(!objectKey || objectKey?.permissions?.length === 0){
        return res.status(403).json({
            message: 'Forbidden: API Key haven"t permission',
        });
    }
    
    return next();
}