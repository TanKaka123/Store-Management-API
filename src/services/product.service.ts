import { BadRequestError } from "../core/error.response";
import { ClothingModel, ElectronicModel, EPRODUCT_TYPE, IProduct, ProductModel } from "../models/product.mode";
import { Types } from "mongoose";

export class ProductServiceFactory {
    static async createProduct(payload: IProduct) {
        switch (payload.attributes.type) {
            case EPRODUCT_TYPE.CLOTHING:
                return new ClothingProductService(payload).createProduct();
            case EPRODUCT_TYPE.ELECTRONIC:
                return new ElectronicProductService(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid type ${payload.type}`);
        }
    }
}

export class ProductService {
    protected product: IProduct; // Change private to protected

    constructor(product: IProduct) {
        this.product = product;
    }

    async createSingleProduct(attributeId: Types.ObjectId) {
        const { attributes, ...restProduct} = this.product;
        const productDoc = await ProductModel.create({ ...restProduct, _id: attributeId });
        return productDoc.toObject();
    }
}

export class ClothingProductService extends ProductService {
    async createProduct() {
        const newClothing = await ClothingModel.create(this.product.attributes);
        if (!newClothing) {
            throw new BadRequestError('Create new clothing error');
        }
        const newProduct = await super.createSingleProduct(newClothing._id);

        if (!newProduct) {
            throw new BadRequestError('Create new product error');
        }
        return { ...newProduct, attributes: newClothing };
    }
}

export class ElectronicProductService extends ProductService {
    async createProduct() {
        const newElectronic = await ElectronicModel.create(this.product.attributes);
        if (!newElectronic) {
            throw new BadRequestError('Create new clothing error');
        }
        const newProduct = await super.createSingleProduct(newElectronic._id);

        if (!newProduct) {
            throw new BadRequestError('Create new product error');
        }

        return { ...newProduct, attributes: newElectronic };
    }
}