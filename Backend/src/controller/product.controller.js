import productModel from "../model/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {
  try {
    const { title, description, priceAmount,priceCurrency } = req.body;

   
    const seller = req.user._id;


    let images = [];

    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(async (file) => {
          const uploaded = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });

          return {
            url: uploaded.url,
            fileId: uploaded.fileId || null,
          };
        })
      );
    }

    const product = await productModel.create({
      title,
      description,
      seller,
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR",
      },
      images,
    });


    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
export async function getAllProduct(req,res){
    const seller = req.user

    const products= await productModel.find({
        seller:seller._id
    })

    res.status(200).json({
        message:"Products Fetched successfully",
        success:false,
        products

    })
}
export async function getAllpProducts(req, res) {

  try {

    const products = await productModel.find()
     

    res.status(200).json({
      success: true,
      message: "Fetched all products",
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}