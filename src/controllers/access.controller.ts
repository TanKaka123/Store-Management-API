import { Request, Response, NextFunction } from 'express';
import { AccessService } from '../services/access.service';
import { Created, SuccessResponse } from '../core/success.response';

class AccessController {
    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await AccessService.signUp(req.body);
            new Created("Sign up successful !", data).send(res)
        } catch (error) {
            next(error);
        }
    };
    
    logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
           const data = await AccessService.login(req.body);
           new SuccessResponse({
            message: "Login successful",
            statusCode: 200,
            metadata: data,
           }).send(res);
        } catch (error) {
            next(error);
        }
    };
}

export default new AccessController();
