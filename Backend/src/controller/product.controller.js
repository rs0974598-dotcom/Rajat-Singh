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
export async function getAllProductDetails(req, res) {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    console.log(product);
    
   
    return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

export async function addProductVariants(req, res) {

  try {

    const productId = req.params.productId;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false
      });
    }

    const files = req.files;
    const images = [];

    if (files?.length > 0) {

      await Promise.all(

        files.map(async (file) => {

          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
          });

          images.push(image);

        })

      );

    }

    const price = req.body.priceAmount;
    const stock = req.body.stock;

    const attribute = JSON.parse(
      req.body.attribute || "{}"
    );
    console.log(product,images,price,stock,attribute); 
           product.varaints.push({
                     images,
            price: {
                amount: Number(price || product.price.amount),
                currency: req.body.currency || product.price.currency
              },
                stock: Number(stock),
                 attribute
              });

await product.save();
    
    return res.status(200).json({
      success: true,
      images,
      price,
      stock,
      attribute
    });
    } catch (error) {
  console.log("ERROR =>", error);

  return res.status(500).json({
    success: false,
    message: error.message,
    error
  });

}

}