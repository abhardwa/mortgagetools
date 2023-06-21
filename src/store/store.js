import { configureStore } from '@reduxjs/toolkit';
import { userReducer,login, logout, getUser }  from './slices/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export { store };
export {login, logout, getUser };