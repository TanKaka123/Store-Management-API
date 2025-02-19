import { Request } from 'express';
import { ShopModel as ShopModel } from '../models/shop.model';
import { SignupDTO } from '../dto/access.dto';
import bcrypt from "bcrypt";
import crypto from "crypto";
import { KeyTokenService } from './keyToken.service';
import { createPairToken } from '../auth/auth.utils';
import { getIntoData } from '../utils';
import { BadRequestError, UnthorizedError } from '../core/error.response';
import { ShopService } from './shop.service';

const ROLES_SHOP = {
    SHOP: 0,
    WRITE: 1,
    EDITOR: 2
}

export class AccessService {
    static handleRefreshToken = async ({ refreshToken }: { refreshToken: string }) => {
        const storedToken = await KeyTokenService.findByRefreshToken(refreshToken);

        if (!storedToken) {
            throw new UnthorizedError("Invalid or expired refresh token")
        }

        const storedShop = await ShopService.findShopByUserId(storedToken.userId)

        if (!storedShop) {
            throw new BadRequestError("Error: shop is not found")
        }

        await KeyTokenService.removeByUserId(storedToken.userId);

        const newPairToken = await createPairToken(
            { userId: storedToken.userId, email: storedShop.email }, storedToken.publicKey, storedToken.privateKey
        )

        if (!newPairToken) {
            throw new BadRequestError("Error: refresh token error")
        }

        await KeyTokenService.createKeyToken({
            userId: storedToken.userId,
            privateKey: storedToken.privateKey,
            publicKey: storedToken.publicKey,
            refreshToken: newPairToken.refreshToken
        })

        return {
            tokens: newPairToken
        }

    }

    static logout = async ({ userId }: { userId: string }) => {
        return await KeyTokenService.removeByUserId(userId);
    }

    static login = async ({ email, password, refreshToken }: { email: string, password: string, refreshToken?: string }) => {
        // 0. find shop by user id
        const foundShop = await ShopService.findShopByEmail(email);
        if (!foundShop) {
            throw new BadRequestError("Not found shop");
        }

        // 1. compare password
        const matchPassword = bcrypt.compare(password, foundShop.password);
        if (!matchPassword) throw new UnthorizedError('Authentication error');

        // 2. create private key and public key
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });

        // 3. create token
        const tokens = await createPairToken({ userId: foundShop._id, email }, publicKey, privateKey);

        if (!tokens) {
            throw new BadRequestError("Authentication error");
        }

        // 4. store refresh token, public key, private key
        await KeyTokenService.createKeyToken({
            userId: (foundShop._id as any).toString(),
            privateKey,
            publicKey,
            refreshToken: tokens?.refreshToken
        })

        // 5. return data
        return {
            shop: getIntoData({
                fields: ["_id", "name", "email", "password", "status", "verify", "roles", "createdAt", "updatedAt"],
                object: foundShop
            }),
            tokens
        }
    }

    static signUp = async ({ name, password, email }: SignupDTO) => {
        const holderShop = await ShopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError("Error: shop already created")
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await ShopModel.create({
            name, email, password: passwordHash, roles: [ROLES_SHOP.SHOP]
        })
        if (newShop) {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });

            const tokens = await createPairToken(
                { userId: (newShop._id as any).toString(), email },
                publicKey,
                privateKey
            )

            if (!tokens?.refreshToken) {
                throw new BadRequestError("Error: Key error")
            }

            await KeyTokenService.createKeyToken({
                userId: (newShop._id as any).toString(),
                publicKey,
                privateKey,
                refreshToken: tokens?.refreshToken
            });

            return {
                shop: getIntoData({
                    fields: ["_id", "name", "email", "password", "status", "verify", "roles", "createdAt", "updatedAt"],
                    object: newShop
                }),
                tokens
            }
        }

    }
}