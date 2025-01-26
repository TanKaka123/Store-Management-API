import access from './access';
import { checkApiKey, checkPermissions } from "../auth/checkAuth";
import { Router, Request, Response, NextFunction } from "express";
import { authentication } from '../auth/auth.utils';

const router = Router();

// check api key
router.use(checkApiKey)
// check permission
router.use(checkPermissions);

router.use('/v1/api', access);

// NOT FOUND ENDPOINT
router.use((_, __, next) => {
    const error = new Error("Not Found") as Error & { status?: number };
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