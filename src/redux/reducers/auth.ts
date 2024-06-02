import { getProfileCMS } from "@/services/auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

interface IState {
  isAuthenticated?: boolean;
  account?: any;
  loading?: boolean;
}
export const fetchDataCMS = createAsyncThunk("/get-profile-cms", async (arg?: any) => {
  const { setSke } = arg;
  const token = localStorage.getItem("access_token_cms");
  const res = await getProfileCMS(String(token));
  if (res.status === 200) {
    setSke(false);
  }
  return res.data;
});
const initialState: IState = {
  isAuthenticated: false,
  account: {},
  loading: false,
};

const slicer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticate: (
      state,
      action: PayloadAction<{
        isAuthenticated?: boolean;
        account?: any;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated ?? state.isAuthenticated;
      state.account = action.payload.account;
    },
  },
  extraReducers: (builder) => {

    builder.addCase(fetchDataCMS.fulfilled, (state, action) => {
      state.account = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchDataCMS.rejected, (state) => {
      state.isAuthenticated = false;
    });
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    });
  },
});

export const { setAuthenticate } = slicer.actions;

export default slicer.reducer;
