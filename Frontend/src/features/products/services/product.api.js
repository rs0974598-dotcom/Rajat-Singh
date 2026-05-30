import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/products",
  withCredentials: true,
});

// 🛒 Create Product
export async function createProducts(formData) {
  const response = await productApiInstance.post("/", formData);

  return response.data;
}

// 📦 Get Seller Products
export async function getAllProducts() {
  const response = await productApiInstance.get("/seller");

  return response.data;
}

export async function getAllpProducts()
{
  const response = await productApiInstance.get("/");
  return response.data
}
export async function getAllProductById(productId)
{
  const response = await productApiInstance.get(`/detail/${productId}`)
  return response.data
}

export async function addProductVariants(
  productId,
  newProductVariants
) {
  const formData = new FormData();

  newProductVariants.images.forEach((image) => {
    if (image.file) {
      formData.append("images", image.file);
    }
  });

  formData.append("stock", newProductVariants.stock);

  formData.append(
    "priceAmount",
    newProductVariants.price.amount
  );

  formData.append(
    "currency",
    newProductVariants.price.currency
  );

  formData.append(
    "attribute",
    JSON.stringify(newProductVariants.attributes)
  );

  const response = await productApiInstance.post(
  `/${productId}/variants`,
  formData
  );

  return response.data;
}