import { model, Model, Schema } from "mongoose";


export interface IKeyToken {
    userId: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string
}

const DOCUMENT_NAME = "KeyTokens";
const COLLCTION_NAME = "KeyToken";

const keyTokenSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        maxLength: 150
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        require: true
    }
}, {
    collection: COLLCTION_NAME,
    timestamps: true
})

export default model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema)