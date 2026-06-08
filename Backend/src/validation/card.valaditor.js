import { body, param } from "express-validator";

export const cartValidation = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product ID"),

    param("variantId")
        .optional()
        .isMongoId()
        .withMessage("Invalid variant ID"),

    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a number greater than 0")
];

export const validateIncrementCartItemsQuantity=[
    param("productId")
      .isMongoId()
      .withMessage("Invalid product ID"),
    
    param("variantId")
        .optional()
        .isMongoId()
        .withMessage("Invalid variant ID"),
]