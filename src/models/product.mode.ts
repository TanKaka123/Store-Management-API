import { model, Schema } from "mongoose";
import { COLLECTION_NAME as COLLECTION_SHOP_NAME } from "./shop.model";
import { NextFunction } from "express";
import slugify from 'slugify';


export enum EPRODUCT_TYPE {
    ELECTRONIC = "Electronic",
    CLOTHING = "Clothing",
    FURNITURE = "Furniture"
};

const COLLECTION_PRODUCT_NAME = "products";
const COLLECTION_CLOTH_NAME = "clothes";
const COLLECTION_ELECTRONIC_NAME = "electronics";

const DOCUMENT_PRODUCT_NAME = "products";
const DOCUMENT_CLOTH_NAME = "clothes";
const DOCUMENT_ELECTRONIC_NAME = "electronics";


export interface IClothing {
    type: EPRODUCT_TYPE.CLOTHING,
    brand: string
    size?: string
    material?: string
}

export interface IElectronic {
    type: EPRODUCT_TYPE.ELECTRONIC,
    manufacturer: string
    model?: string
    color?: string
}

export type ProductAttributesType = IClothing | IElectronic;

export interface IProduct {
    name: string,
    thumb: string,
    description?: string,
    price: number
    quantity: number
    type: string
    shop: string
    attributes: ProductAttributesType
    slug?: string
}


const ProductSchema = new Schema({
    name: { type: String, required: true },
    thumb: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true, enum: EPRODUCT_TYPE },
    shop: { type: Schema.Types.ObjectId, ref: COLLECTION_SHOP_NAME },
    slug: { type: String },
    averageRating: {
        type: Number,
        min: [1, "Rating must be above 1"],
        max: [5, "Rating must be below 5"],
        set: (val: number) => Math.round(val * 10) / 10,
        default: 4.5
    },
    variants: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    }
    // attributes: { type: Schema.Types.Mixed, required: true }
}, {
    timestamps: true,
    collection: COLLECTION_PRODUCT_NAME
})


ProductSchema.pre<IProduct>('save', function (this: IProduct, next: any) {
    this.slug = slugify(this.name, { lower: true });
    next();
});


// CLOTHING
const ClothingSchema = new Schema({
    type: String,
    brand: { type: String, required: true },
    size: String,
    material: String
}, {
    timestamps: true,
    collection: COLLECTION_CLOTH_NAME
})

// ELECTRONIC
const electronicSchema = new Schema({
    type: String,
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: COLLECTION_SHOP_NAME }
}, {
    timestamps: true,
    collection: COLLECTION_ELECTRONIC_NAME
})

export const ProductModel = model(DOCUMENT_PRODUCT_NAME, ProductSchema);
export const ClothingModel = model(DOCUMENT_CLOTH_NAME, ClothingSchema);
export const ElectronicModel = model(DOCUMENT_ELECTRONIC_NAME, electronicSchema);

