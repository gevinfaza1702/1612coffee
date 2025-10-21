import express from "express";
import { addProduct, getProducts, getProductById, deleteProduct, addMultipleProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/", addProduct);
router.post("/bulk", addMultipleProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
