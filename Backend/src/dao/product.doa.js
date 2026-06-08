import Product from "../model/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
  const product = await Product.findById(productId);

  console.log("PRODUCT ID:", productId);
  console.log("VARIANT ID:", variantId);
  console.log("VARIANTS:", product.variants);

  if (!product) throw new Error("Product not found");

  const variant = product.variants.find(
    v => v._id.toString() === variantId
  );

  console.log("FOUND VARIANT:", variant);

  if (!variant) throw new Error("Variant not found");

  return variant.stock;
};