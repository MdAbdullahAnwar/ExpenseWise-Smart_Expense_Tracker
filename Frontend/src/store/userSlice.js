import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPremium: false,
  userInfo: null,
  monthlyBudget: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserPremium: (state, action) => {
      state.isPremium = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isPremium = action.payload?.isPremium || false;
      state.monthlyBudget = action.payload?.monthlyBudget || 0;
    },
    setMonthlyBudget: (state, action) => {
      state.monthlyBudget = action.payload;
      if (state.userInfo) {
        state.userInfo.monthlyBudget = action.payload;
      }
    },
  },
});

export const { setUserPremium, setUserInfo, setMonthlyBudget } = userSlice.actions;
export default userSlice.reducer;
