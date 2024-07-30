import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { cartList: [] },
  reducers: {
    add(state, action) {
      let index = state.cartList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index === -1) {
        state.cartList.push(action.payload);
      } else {
        state.cartList[index] = {
          ...state.cartList[index],
          amount: action.payload.amount,
        };
      }
    },
    reduce(state, action) {
      let findIndex = state.cartList.findIndex(
        (items) => items.id === action.payload.id
      );
      let quant = state.cartList[findIndex].amount;
      if (quant === 1) {
        state.cartList = state.cartList.filter(
          (items) => items.id !== action.payload.id
        );
      } else {
        state.cartList[findIndex] = {
          ...state.cartList[findIndex],
          amount: state.cartList[findIndex].amount - 1,
        };
      }
    },

    get(state, action) {
      state.cartList = [...action.payload];
    },
  },
});

export const cartAction = cartSlice.actions;
export default cartSlice.reducer;
