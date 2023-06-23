import { createSlice } from '@reduxjs/toolkit';

export const loanSlice = createSlice({
  name: 'amort',
  initialState: {
    args: {
    lamount: 350000,
    lterm: 30,
    lrate: 6.25,
    startDate:(new Date()).toISOString().substring(0, 10),
    recurMAmt: 0,
    recurMDate: (new Date()).toISOString().substring(0, 10),
    recurAAmt: 0,
    recurADate: (new Date()).toISOString().substring(0, 10),
    onePayAmt: 0,
    onePayDate: (new Date()).toISOString().substring(0, 10),
    },
    ltable:null,
  },
  reducers: {
    setArgs: (state, action) => {
      // console.log('inside setArgs', state, action);
      state.args[action.payload.key] = action.payload.value;
    },
    setLtable: (state, action) => {
      state.ltable = action.payload;
      // console.log(state.ltable);
    },
  },
});


// selectors
export const getLoanTable = (state) => state.amort.ltable;
export const getLoanArgs = (state) => state.amort.args;
// actions and reducer
export const { setArgs, setLtable } = loanSlice.actions;
export const loanReducer = loanSlice.reducer;
