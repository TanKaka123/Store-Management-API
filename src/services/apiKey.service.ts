import apiKeyModel from "../models/apiKey.model"

export const findByKey = async (key: string) => {
    return await apiKeyModel.findOne({ key, status: true }).lean();
}

export const createApiKey = async (key: string) => {
    return await apiKeyModel.create({ key, status: true, permission: ["0000"] });
}