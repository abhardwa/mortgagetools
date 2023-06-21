import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      
    },
    logout: (state) => {
      state.user = null;
    },
  },
});


// selectors
export const getUser = (state) => state.user.user;
// actions and reducer
export const { login, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
