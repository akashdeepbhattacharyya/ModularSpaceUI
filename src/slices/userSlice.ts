import { get } from "lodash";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { isValid } from "date-fns";
import type { RootState } from "../store/store";
import { setLoading } from "./commonSlice";
import { isAPIResponseFailure } from "../api/base";
import { getAccountManager } from "../api/user";
import appLogger from "../infrastructure/appLogger";

export interface ModifyType {
  lastDate: string;
}

export interface AuthData {
  record_id: number;
  user_id: number;
  logged_in_id?: string;
  email: string;
  token: string;
  full_name: string;
  profile_image: string;
  has_token: boolean;
  role_name: string | null;
  user_status: string;
  requested_at: string;
  is_gac?: boolean;
  account: number;
  user_type: string;
  account_number: string | number;
  allow_user?: boolean;
}

const sliceName = "account";

export interface InitialState {
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  user: null | AuthData;
  allAccountCount: number;
  allAccountPages: number;
  getUserProfile: any;
  subscriptionTierLoading: boolean;
  dashboardDataLoading: boolean;
  allAccountListManage: any | null;
  userModifyData: null | ModifyType;
  allAccountListManageLoading: boolean;
}

const initialState: InitialState = {
  page: 1,
  perPage: 10,
  totalCount: 0,
  totalPages: 0,
  allAccountCount: 0,
  allAccountPages: 0,
  allAccountListManage: [],
  allAccountListManageLoading: false,
  getUserProfile: [],
  dashboardDataLoading: false,
  subscriptionTierLoading: false,
  user: null,
  userModifyData: null,
};

export const fetchUserProfile = createAsyncThunk<any, any>(
  `${sliceName}/accountfetch`,
  async (params, ThunkAPI) => {
    appLogger.log(params);
    const loaderName = `${sliceName}/accountfetch`;
    ThunkAPI.dispatch(setLoading([loaderName, true]));
    try {
      const response = await getAccountManager(params);
      ThunkAPI.dispatch(setLoading([loaderName, false]));
      if (isAPIResponseFailure(response)) {
        return ThunkAPI.rejectWithValue(response);
      }
      return response.data;
    } catch (e) {
      appLogger.error(e);
    } finally {
      ThunkAPI.dispatch(setLoading([loaderName, false]));
    }
    return [];
  }
);

// @TODO - Add thunk reducer as well
const accountSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setUserDetails: (state, payload: PayloadAction<AuthData>) => {
      console.log(payload);
      state.getUserProfile = payload.payload;
    },
    handleRefreshUserData: (state, payload: PayloadAction<null | string>) => {
      const payLoadValue = payload.payload || "";
      const date = new Date(payLoadValue);
      if (isValid(date)) {
        state.userModifyData = {
          lastDate: payLoadValue,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.getUserProfile = [];
      state.subscriptionTierLoading = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      const { payload } = action;
      console.log(payload);
      state.getUserProfile = get(payload, "data");
      state.subscriptionTierLoading = false;
    });
    builder.addCase(fetchUserProfile.rejected, (state) => {
      state.getUserProfile = [];
      state.subscriptionTierLoading = false;
    });
  },
});

export const { setUserDetails, handleRefreshUserData } = accountSlice.actions;

export default accountSlice.reducer;

export const accountStateItem = createSelector(
  (state: RootState) => state.user,
  (items: InitialState) => items
);
