const STATUS_ERROR = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    BAD_REQUEST: 409,
    NOT_FOUND: 404
}

const REASON_ERROR = {
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Bad request error",
    BAD_REQUEST: "Bad request error",
    NOT_FOUND: "Not found error"
}

class ErrorResponse extends Error {
    status: number;
    constructor(message: string, status: number){
        super(message);
        this.status = status;
    }    
}

export class ConfictRequestError extends ErrorResponse {
    constructor(message: string = REASON_ERROR.FORBIDDEN, statusCode: number = STATUS_ERROR.FORBIDDEN){
        super(message, statusCode);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message: string = REASON_ERROR.BAD_REQUEST, statusCode: number = STATUS_ERROR.BAD_REQUEST){
        super(message, statusCode);
    }
}

export class UnthorizedError extends ErrorResponse {
    constructor(message: string = REASON_ERROR.UNAUTHORIZED, statusCode: number = STATUS_ERROR.UNAUTHORIZED){
        super(message, statusCode);
    }
}

export class NotFoundError extends ErrorResponse {
    constructor(message: string = REASON_ERROR.NOT_FOUND, statusCode: number = STATUS_ERROR.NOT_FOUND){
        super(message, statusCode);
    }
}
