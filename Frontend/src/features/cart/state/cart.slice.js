import { createSlice } from "@reduxjs/toolkit";

const cartSlice =createSlice({
    name:"cart",
    initialState:{
        items:[],

    },
    reducers:{
        setCart:(state,action)=>{
            state.items = action.payload
        },
        addItems:(state,action)=>{
            state.items.push(action.payload)

        }
    }

})
export const {setCart,addItems}=cartSlice.actions
export default cartSlice.reducer
