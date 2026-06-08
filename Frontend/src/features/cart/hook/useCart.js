
import { addToCart, getCart,incrementCartItem,decrementCartItem } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems, additems ,incrementCart,decrementCart} from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    async function handleAddItems({ productId, variantId }) {
    const data = await addToCart({ productId, variantId });

    await handleGetCart(); // fresh cart fetch

    return data;
}

    async function handleGetCart() {
        const data = await getCart();
        dispatch(setItems(data.cart?.[0]?.items || []))

        return data;
    }
  async function handleIncrementCartItems({productId, variantId}) {
    await incrementCartItem(productId, variantId);

    dispatch(
        incrementCart({
            productId,
            variantId
        })
    );
}
async function handleDecrementCartItems({productId,variantId})
{
    await decrementCartItem(productId,variantId);

    dispatch(
        decrementCart({
            productId,
            variantId
        })
    )
}
    return { handleAddItems, handleGetCart,handleIncrementCartItems,handleDecrementCartItems };
};