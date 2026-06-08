import {createSlice} from "@reduxjs/toolkit"

 const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items:[],
    },
    reducers:{
        
        setItems:(state,action)=>{
            state.items = action.payload;
        },
        additems:(state,action)=>{
            state.items.push(action.payload)
        },
         incrementCart: (state, action) => 
        {
            const { productId, variantId } = action.payload

            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item
                }
            })
        },
        decrementCart:(state,action)=>{
            const {productId,variantId} =action.payload

            state.items = state.items.map(item=>{
                if(item.product._id === productId && item.variant === variantId)
                {
                    return {...item,quantity:item.quantity-1}
                }
                else{
                    return item
                }
            })
        }
       
    }
})

export const { setItems, additems,incrementCart,decrementCart } = cartSlice.actions;
export default cartSlice.reducer;