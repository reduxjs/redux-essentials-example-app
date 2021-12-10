import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: "Nota 1", title: "Nota 1", content: "10" },
  { id: "Nota 2", title: "Nota 2", content: "9" },
  { id: "Nota 3", title: "Nota 3", content: "9" }
];

const avaliationsSlice = createSlice({
  name: "avaliations",
  initialState,
  reducers: {
    avaliationAdded(state, action) {
      state.push(action.payload);
    }
  }
});
export const { avaliationAdded } = avaliationsSlice.actions;

export default avaliationsSlice.reducer;
