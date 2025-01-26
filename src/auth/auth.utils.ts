import JWT from "jsonwebtoken";
import { asyncHandler } from "../helpers/ansycHandler";
import { Request, Response } from "express";
import { NotFoundError, UnthorizedError } from "../core/error.response";
import { KeyTokenService } from "../services/keyToken.service";
import { Types } from "mongoose";

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLIENT_ID: "x-client-id"
};

export const createPairToken = async (payload: Record<string, any>, publicKey: string, privateKey: string) => {
    try {

        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error("error verify", err);
            }
            else {
                console.log("decode verified", decode);
            }
        })

        return { accessToken, refreshToken };
    }
    catch (error) {
        console.error("Create access and refresh token error: ", error)
    }
}


export const authentication = asyncHandler(async (req: Request, res: Response, next) => {
    /* 
    1. check userId
    2. get accessToken
    3. verify
    4. check userId in DB
    5. check keystore
    6. return next
    */

    const userId = req.headers[HEADER.CLIENT_ID];

    if (!userId || typeof userId !== 'string') throw new UnthorizedError('Invalid request');

    // 2 
    const keyStore = await KeyTokenService.findByUserId(new Types.ObjectId(userId));
    if (!keyStore) throw new NotFoundError('Invalid key');

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken || typeof accessToken !== 'string') throw new UnthorizedError('Invalid request');

    try {
        const decodedUser = JWT.verify(accessToken, keyStore.publicKey) as { userId: string };
        if (userId !== decodedUser.userId) {
            throw new UnthorizedError('Invalid User');
        }
        (req as any).keyStore = keyStore;
        return next();
    }
    catch (error) {
        throw error;
    }
})