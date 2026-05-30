import { createProducts, getAllProducts ,getAllpProducts,getAllProductById,addProductVariants} from "../services/product.api";
import { setProduct, setshowproduct } from "../state/product.slice";
import { useDispatch } from "react-redux";

export const useProducts = () => {
    const dispatch = useDispatch();

    // ── Create Product ──
   async function handleCreateProducts(formData) {
    try {
        const data = await createProducts(formData);
        return data.product;
    } catch (err) {
        
        if (err.response?.status === 401) {
            throw new Error("Please login to create a product.");
        }
        throw new Error(err.response?.data?.message || "Something went wrong.");
    }
}
    // ── Get All Products ──
    async function handleGetAllProducts() {
       
        
            const data = await getAllProducts();

            dispatch(setProduct(data.products));

            return data.products;

       
    }

    async function handleGetAllPProducts()
    {
        const data = await getAllpProducts();
        dispatch(setshowproduct(data.products));
        return data.products;
    }
    async function handleGetProductById(productId)
    {
        const data = await getAllProductById(productId);
        return data
    }
  async function handleAddProdcutVaraints(
  productId,
  newProductVaraints
) {
  const data = await addProductVariants(
    productId,
    newProductVaraints
  );

  return data;
}
    return { handleCreateProducts, handleGetAllProducts,handleGetAllPProducts ,handleGetProductById,handleAddProdcutVaraints};
};
