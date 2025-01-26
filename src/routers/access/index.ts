import { Router } from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helpers/ansycHandler";

const router = Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.logIn))


export default router;