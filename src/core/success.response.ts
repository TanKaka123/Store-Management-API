import { Response } from "express";

const STATUS_CODE = {
    OK: 200,
    CREATED: 201
}

const REASON_STATUS = {
    OK: "Success",
    CREATED: "Created"
}

export class SuccessResponse {
    message: string;
    statusCode: number;
    metadata: Record<string, string>;

    constructor({ message = REASON_STATUS.OK, statusCode = STATUS_CODE.OK, metadata }: { message: string, statusCode?: number, metadata: Record<string, any> }) {
        this.message = message
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res: Response, header = {}) {
        return res.status(this.statusCode).json(this)
    }
}


export class OK extends SuccessResponse {
    constructor(message: string, metadata: Record<string, any>) {
        super({ message, metadata })
    }
}

export class Created extends SuccessResponse {
    constructor(message: string, metadata: Record<string, any>) {
        super({ message, statusCode: STATUS_CODE.CREATED, metadata })
    }
}