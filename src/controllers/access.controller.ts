import { Request, Response, NextFunction } from 'express';
import { AccessService } from '../services/access.service';
import { Created, SuccessResponse } from '../core/success.response';
import { AuthRequest } from '../type/request';

class AccessController {
    logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try{
            await AccessService.logout({userId: req.keyStore.userId});
            new SuccessResponse({
                message: 'Logout successful !'
            }).send(res)
        }
        catch(error){
            next(error);
        }
    }

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
