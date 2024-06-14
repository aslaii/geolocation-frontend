import { createSlice } from '@reduxjs/toolkit';

export const toastSlice = createSlice({
  name: 'toast',
  initialState: [],
  reducers: {
    addToast: (state, action) => {
      state.push(action.payload);
    },
    removeToast: (state) => {
      state.shift();
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
