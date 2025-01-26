import { model,  Schema } from "mongoose";

const DOCUMENT_NAME = "apiKeys";
const COLLECTION_NAME = "apiKey";

const EPermission = ["0000", "1111", "2222"];
interface IApiKeySchema {
    key: string,
    status: boolean,
    permission: string[],
    createdAt: Date
}

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: EPermission
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d'
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

export default model<IApiKeySchema>(DOCUMENT_NAME, apiKeySchema)