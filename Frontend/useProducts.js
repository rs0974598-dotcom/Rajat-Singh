import { createProducts, getAllProducts } from "../services/product.api";
import { setProduct, setLoading, setError } from "../state/product.slice";
import { useDispatch } from "react-redux";

export const useProducts = () => {
    const dispatch = useDispatch();

    // ── Create Product ──
    async function handleCreateProducts(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await createProducts(formData);

            return data.product;

        } catch (error) {
            dispatch(setError(error?.message ?? "Failed to create product"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    // ── Get All Products ──
    async function handleGetAllProducts() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getAllProducts();

            dispatch(setProduct(data.products));

            return data.products;

        } catch (error) {
            dispatch(setError(error?.message ?? "Failed to fetch products"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleCreateProducts, handleGetAllProducts };
};
