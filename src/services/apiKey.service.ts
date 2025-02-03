import apiKeyModel from "../models/apiKey.model"

export class ApiKeyService {
    static findByKey = async (key: string) => {
        return await apiKeyModel.findOne({ key, status: true }).lean();
    }
    
    static createApiKey = async (key: string) => {
        return await apiKeyModel.create({ key, status: true, permission: ["0000"] });
    }
    
}