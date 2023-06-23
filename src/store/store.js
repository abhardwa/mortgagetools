import { configureStore } from '@reduxjs/toolkit';
import { userReducer,login, logout, getUser }  from './slices/userSlice';
import {loanReducer } from './slices/loanSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import {loanApi} from './apis/loanapi';

const store = configureStore({
  reducer: {
    user: userReducer,
    amort: loanReducer,
    [loanApi.reducerPath]:loanApi.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
    .concat(loanApi.middleware);
  }
});

setupListeners(store.dispatch);
export { useFetchAmortizationQuery, useSaveAnalysisMutation } from './apis/loanapi';

export { store };
export {login, logout, getUser };
export {setArgs, setLtable, getLoanTable, getLoanArgs } from './slices/loanSlice';