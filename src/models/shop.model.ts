import { Schema, Document, model } from "mongoose";

export interface IShop extends Document {
  name: string;
  email: string;
  password: string;
  status: 'active' | 'inactive';
  verify: boolean;
  roles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const COLLECTION_NAME = 'Shops';
const DOCUMENT_NAME = 'Shop';

const shopSchema = new Schema<IShop>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export const ShopModel = model<IShop>(DOCUMENT_NAME, shopSchema);
