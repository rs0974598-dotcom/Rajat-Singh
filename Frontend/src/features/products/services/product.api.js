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
