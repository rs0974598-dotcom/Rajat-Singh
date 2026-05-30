import mongoose from "mongoose";

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
    varaints:[
      {
        images:[
          {
            url:{
              type:String,
              required:true
            }
          }
        ],
        stock:{
          type:Number,
          default:0
        },
        attribute:{
          type:Map,
          of:String
        },
        price:{
          amount:{
            type:Number,
            required:true
          },
          currency:{
            type:String,
            enum:["USD","EUR","GBP","JPY","INR"],
            default:"INR"
          }
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