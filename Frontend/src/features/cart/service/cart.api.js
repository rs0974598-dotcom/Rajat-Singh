
import axios from "axios";

const apiInstance = axios.create({
    baseURL: "http://localhost:3000/api/cart",
    withCredentials: true
});

export async function addToCart({ productId, variantId }) {
    const response = await apiInstance.post(
        `/add/${productId}/${variantId}`,
        { quantity: 1}
    );

    return response.data;
}

export async function getCart() {
    const response = await apiInstance.get("/");
    return response.data;
}
export async function incrementCartItem(productId, variantId) {
    const response = await apiInstance.patch(
        `/quantity/increment/${productId}/${variantId}`
    );

    return response.data;
}

export async function decrementCartItem(productId,variantId){
    const response = await apiInstance.patch(
        `/quantity/decrement/${productId}/${variantId}`
    )
    return response.data
}