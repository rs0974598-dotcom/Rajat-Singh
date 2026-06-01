
import { stockOfVariant } from "../dao/product.doa.js";
import cartModel from "../model/cart.model.js";
import Product from "../model/product.model.js";


export async function addToCart(req,res)
{
    const {productId,variantId}= req.params 
    const product = await Product.findOne({
        _id:ProductId,
        "variants._id":variantId

    })
    if(!product)
    {
        res.status(404).json({
            message:"Prodcut or variant not found",
            success:false
        })
    }
    const stock = await stockOfVariant(productId,variantId)

    const cart = (await cartModel.findOne({
        user:req.user._id
    })) || await cartModel.create({user:req.user._id}) 

   const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

   if (isProductAlreadyInCart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                success: false
            })
        }

        await cartModel .findByIdAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )
         return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        })
    }
    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.price
    })

    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })
}

export async function getToCart(req,res)
{
    const user = req.user
    let cart = await cartModel.findOne({
        user:user._id,
    }).populate("items.product")

    if(!cart)
    {
        cart = await cartModel.create({user:user._id})
    }
    return res.status(200).json({
        message:"Cart Fetched successfully",
        success:true,
        cart
    })
}