import { Router } from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helpers/ansycHandler";
import { authentication } from "../../auth/auth.utils";

const router = Router();
router.post('/api-key', asyncHandler(accessController.createApiKey));

router.post('/shop/signup', asyncHandler(accessController.signUp));

router.post('/shop/login', asyncHandler(accessController.logIn));

router.use(authentication);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken));


export default router;