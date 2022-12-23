const { createSlice } = require('@reduxjs/toolkit');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
  },
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { login } = userSlice.actions;
export const selectUser = (state) => state.user.data;
export default userSlice.reducer;
