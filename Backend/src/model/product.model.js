import mongoose from "mongoose";
import priceSchema from "./price.model.js";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    price: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        enum: ["INR", "USD", "EUR"],
        default: "INR",
      },
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "product image",
        },
      },
    ],
    variants: [
  {
    images: [
      {
        url: { type: String, required: true }
      }
    ],

    stock: {
      type: Number,
      default: 0
    },

    attribute: {
      type: Map,
      of: String
    },

    price: {
      type: priceSchema,
      required: true
    }
  }
]
  },
  {
    timestamps: true, 
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;