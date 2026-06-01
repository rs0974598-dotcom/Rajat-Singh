import { useDispatch } from "react-redux";
import { addToCart } from "../service/cart.api";
import { addItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItems({ productId,  variantId}) {
        const data = await addToCart(productId, variantId);

        dispatch(addItems(data));

        return data;
    }

    return { handleAddItems };
};