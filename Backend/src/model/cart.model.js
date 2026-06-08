import mongoose from "mongoose";
import priceSchema from "./price.model.js";
import Product from "./product.model.js";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
},
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            variant: {
               type: mongoose.Schema.Types.ObjectId,
               required: Product.variants
},
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
})

const cartModel = mongoose.model('cart', cartSchema);

export default cartModel;