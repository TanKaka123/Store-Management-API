import { Types } from "mongoose";
import { KeyTokenDTO } from "../dto/keyToken.dto";
import keyTokenModel from "../models/keyToken.model";

export class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: KeyTokenDTO) => {
        const filters = { userId };
        const update = {
            publicKey, privateKey, refreshTokensUsed: [], refreshToken
        };
        const options = { upsert: true, new: true };
        const tokens = await keyTokenModel.findOneAndUpdate(filters, update, options);

        return {
            publicKey: tokens?.publicKey,
            privateKey: tokens?.privateKey
        };

    }

    static findByUserId = async (userId: Types.ObjectId) => {
        return await keyTokenModel.findOne({ userId }).lean();
    }

    static removeByUserId = async (userId: string) => {
        return await keyTokenModel.deleteOne({ userId });
    }
    
    static findByRefreshToken = async (refreshToken: string) =>{
        return await keyTokenModel.findOne({refreshToken}).lean();
    }
}