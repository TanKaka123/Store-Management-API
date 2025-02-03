import { ProductModel } from "../product.mode";

interface FindAllDraftProductParams {
    query: Record<string, any>;
    limit?: number;
    skip?: number;
}

export const findAllProduct = async ({
    query = {},
    limit = 10,
    skip = 0,
}: FindAllDraftProductParams): Promise<any[]> => {
    const products = await ProductModel.find(query)
        .populate('shop', 'name email _id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

    return products;

};