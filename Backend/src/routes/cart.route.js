import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { cartValidation, validateIncrementCartItemsQuantity } from "../validation/card.valaditor.js";
import { validateRequest } from "../middleware/cart.middleware.js";
import { addToCart ,getCart, incrementCartItemQuantity,decrementCartItemQuantity} from "../controller/cart.controller.js";


const router = express.Router();

router.post(
  "/add/:productId/:variantId",
  authenticateUser,
  cartValidation,
  validateRequest,
  addToCart
);
router.get('/',authenticateUser,getCart)


router.patch("/quantity/increment/:productId/:variantId",authenticateUser,validateIncrementCartItemsQuantity,validateRequest,incrementCartItemQuantity)


router.patch(
  '/quantity/decrement/:productId/:variantId',
  authenticateUser,
  validateIncrementCartItemsQuantity,
  validateRequest,
  decrementCartItemQuantity
)


export default router;