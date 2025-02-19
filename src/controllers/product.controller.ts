import { NextFunction, Request, Response } from "express";
import { ProductServiceFactory } from "../services/product.service";
import { ConfictRequestError } from "../core/error.response";
import { SuccessResponse } from "../core/success.response";
import { AuthRequest } from "../type/request";

export class ProductController {
    static async createProduct(req: Request, res: Response, next: NextFunction) {
        const authReq = req as AuthRequest;
        try {
            const newProduct = await ProductServiceFactory.createProduct({ ...req.body, shop: authReq.keyStore.userId });
            if (!newProduct) {
                throw new ConfictRequestError("Create new product error");
            }

            new SuccessResponse({
                message: "Create new product successful",
                metadata: newProduct
            }).send(res);
        }
        catch (error) {
            next(error)
        }
    }

    static async getListDraftProductByShopId(req: Request, res: Response, next: NextFunction) {
        const authReq = req as AuthRequest;
        try {
            const listDraftProduct = await ProductServiceFactory.findAllDraftProductByShopId({ ...req.body, shopId: authReq.keyStore.userId });
            new SuccessResponse({
                message: "Get all draft product by shop id successful",
                metadata: listDraftProduct
            })
        }
        catch (error) {
            next(error);
        }
    }
}