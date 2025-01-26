import apiKeyModel from "../models/apiKey.model"

export const findByKey = async (key: string) => {
    return await apiKeyModel.findOne({ key, status: true }).lean();
}