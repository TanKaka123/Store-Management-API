import { Request } from "express";
import { IKeyToken } from '../models/keyToken.model';

export type AuthRequest = Request & {
    keyStore: IKeyToken
};