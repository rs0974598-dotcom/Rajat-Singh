import {createSlice} from "@reduxjs/toolkit"

const productsSlice = createSlice({
    name:"product",
    initialState:{
        product:[],
        showproduct:[]

    },
    reducers:{
        setProduct:(state,action)=>{
            state.product=action.payload
        },
        setshowproduct:(state,action)=>{
            state.showproduct=action.payload
        }
    }
})
export const {setProduct,setshowproduct} = productsSlice.actions
export default productsSlice.reducer
