
import express from "express"
import { addToCart, getToCart } from "../controller/cart.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/card.middleware.js";


 const router = express.Router()

router.post("/add/:productId/:variantId", validateRequest,authenticateUser,addToCart)
router.get("/",authenticateUser,getToCart)



export default router