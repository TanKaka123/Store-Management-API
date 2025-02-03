import { Types } from "mongoose";
import { ShopModel } from "../models/shop.model"


export class ShopService {
    static findShopByEmail = async (email: string, select: Record<string, number> = {
        email: 1,
        password: 1,
        name: 1,
        status: 1,
        roles: 1
    }) => {
        return await ShopModel.findOne({ email }).select(select).lean();
    }

    static findShopByUserId = async (userId: string, select: Record<string, number> = {
        email: 1,
        password: 1,
        name: 1,
        status: 1,
        roles: 1
    }) => {
        return await ShopModel.findById(new Types.ObjectId(userId)).select(select).lean(0)
    }
}