import { Request, Response, NextFunction } from 'express';
import { AccessService } from '../services/access.service';
import { Created, SuccessResponse } from '../core/success.response';
import { AuthRequest } from '../type/request';
import { BadRequestError } from '../core/error.response';
import { error } from 'console';
import { ApiKeyService } from '../services/apiKey.service';

class AccessController {
    handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newToken = await AccessService.handleRefreshToken({ refreshToken: req.body?.refreshToken })
            new SuccessResponse({
                message: 'Handle refresh token successful !',
                metadata: newToken
            }).send(res)
        }
        catch (error) {
            next(error);
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        try {
            await AccessService.logout({ userId: authReq.keyStore.userId });
            new SuccessResponse({
                message: 'Logout successful !'
            }).send(res)
        }
        catch (error) {
            next(error);
        }
    }

    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await AccessService.signUp(req.body);
            if (!data) {
                throw new BadRequestError();
            }
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

    createApiKey = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newApiKey = crypto.randomUUID()
            const data = await ApiKeyService.createApiKey(newApiKey);
            new SuccessResponse({
                message: "Create API key successful",
                statusCode: 200,
                metadata: data,
            }).send(res);
        }
        catch (error) {
            next(error);
        }
    }
}

export default new AccessController();
