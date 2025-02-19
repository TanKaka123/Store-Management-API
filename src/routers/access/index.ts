import { Router } from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helpers/ansycHandler";
import { authentication } from "../../auth/auth.utils";

const router = Router();
router.post('/api-key', asyncHandler(accessController.createApiKey));

router.post('/auth/signup', asyncHandler(accessController.signUp));

router.post('/auth/login', asyncHandler(accessController.logIn));

router.use(authentication);
router.post('/auth/logout', asyncHandler(accessController.logout));
router.post('/auth/refresh-token', asyncHandler(accessController.handleRefreshToken));


export default router;