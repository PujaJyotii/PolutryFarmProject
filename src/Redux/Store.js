import { configureStore } from "@reduxjs/toolkit";
import FormSlice from "./FormSlice";
import CartSlice from "./CartSlice";

const Store = configureStore({
  reducer: {
    form: FormSlice,
    cart: CartSlice,
  },
});

export default Store;
