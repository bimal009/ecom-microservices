import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controller";
import { shouldBeAdmin } from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/", shouldBeAdmin, createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;