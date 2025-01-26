import access from './access';
import product from './product';
import { checkApiKey, checkPermissions } from "../auth/checkAuth";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

// check api key
router.use(checkApiKey)
// check permission
router.use(checkPermissions);

router.use('/v1/api', access);
router.use('/v1/api', product);

// NOT FOUND ENDPOINT
router.use((_, __, next) => {
    const error = new Error("Not found") as Error & { status?: number };
    error.status = 404;
    next(error);
});

// HANDLE RESPONSE ERROR
router.use((error: Error & { status?: number }, _: Request, res: Response, __: NextFunction) => {
    const errorStatus = error.status || 500;
    res.status(errorStatus).json({
        status: "error",
        code: errorStatus,
        message: error.message || "Internal Server Error",
    });
});

export default router;