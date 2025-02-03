import { Router } from "express";
import { asyncHandler } from "../../helpers/ansycHandler";
import { authentication } from "../../auth/auth.utils";
import { ProductController } from "../../controllers/product.controller";

const router = Router();

router.use(authentication);
router.post('/product', asyncHandler(ProductController.createProduct));
router.get('/product/draft', asyncHandler(ProductController.getListDraftProductByShopId));


export default router;