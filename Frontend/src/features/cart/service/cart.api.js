
import axios from "axios";

const cardApiInstance = axios.create({
    baseURL:"http://localhost:3000/api/card",
    withCredentials:true
})
export async function addToCart(productId, variantId) {
    if (!productId || !variantId) {
        throw new Error("productId or variantId is missing");
    }

    const response = await cardApiInstance.post(
        `/add/${productId}/${variantId}`,
        { quantity: 1 }
    );

    return response.data;
}