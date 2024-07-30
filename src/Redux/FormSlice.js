import { createSlice } from "@reduxjs/toolkit";

const FormSlice = createSlice({
  name: "form",
  initialState: { list: [] },
  reducers: {
    add(state, action) {
      state.list.push(action.payload);
    },
    get(state, action) {
      state.list = [...action.payload];
    },
    delete(state, action) {
      state.list = state.list.filter((item) => item.nameV !== action.payload);
    },
    update(state, action) {
      let index = state.list.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...action.payload };
      }
    },
  },
});

export const formAction = FormSlice.actions;
export default FormSlice.reducer;
