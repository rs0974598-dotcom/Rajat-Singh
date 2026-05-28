import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct, getAllpProducts, getAllProduct, getAllProductDetails } from "../controller/product.controller.js";
import { createProductValidation } from "../validation/product.validator.js";
import { handleValidationErrors } from "../middleware/production.middleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
});

// ✅ Create Product
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidation,
  handleValidationErrors,
  createProduct
);

// ✅ Get Seller Products
router.get("/seller", authenticateSeller, getAllProduct);
router.get("/",getAllpProducts)
router.get("/detail/:id",getAllProductDetails)



export default router;