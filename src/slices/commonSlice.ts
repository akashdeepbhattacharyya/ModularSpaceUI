import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store/store';

type LoadingPayload = [string, boolean];
type LoadingDataType = { [key: string]: any };

export interface InitialState {
  loadingData: LoadingDataType;
  error: any;
  currentTab: string;
  repairTab: string;
  vivacityRepairTab: string;
  inHouseRepairTab: string;
  invoicesOrdersTab: string;
  darklyFeaturesData: any;
  conentCSS: any;
}

const initialState: InitialState = {
  loadingData: {},
  error: null,
  currentTab: 'rep-1',
  repairTab: 'repa-1',
  vivacityRepairTab: 'vr-1',
  inHouseRepairTab: 'ihr-1',
  invoicesOrdersTab: 'tran-1',
  darklyFeaturesData: {},
  conentCSS: {},
};

// @TODO - Add thunk reducer as well
const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, payload: PayloadAction<LoadingPayload>) => {
      const [name, isLoading] = payload.payload;
      state.loadingData[name] = isLoading;
    },
    setGlobalError: (state, actions: PayloadAction<any>) => {
      const { payload } = actions;
      if (axios.isAxiosError(payload)) {
        if (!payload?.response) {
          state.error = 'No Server Response received';
        } else if (payload.response?.status === 400) {
          state.error = 'Missing Username or Password';
        } else if (payload.response?.status === 401) {
          state.error = 'Unauthorized';
        } else if (payload.response?.status === 404) {
          state.error = 'You hit an incorrect API request';
        } else {
          state.error = payload.message || 'Something went wrong';
        }
      } else {
        state.error = 'Something went wrong';
      }
    },
    resetGlobalError: (state) => {
      state.error = null;
    },
    setCurrentTab: (state, payload: PayloadAction<string>) => {
      state.currentTab = payload.payload;
    },
    setRepairTab: (state, payload: PayloadAction<string>) => {
      state.repairTab = payload.payload;
    },
    setVivacityRepairTab: (state, payload: PayloadAction<string>) => {
      state.vivacityRepairTab = payload.payload;
    },
    setInHouseRepairTab: (state, payload: PayloadAction<string>) => {
      state.inHouseRepairTab = payload.payload;
    },
    setDarklyFeaturesData: (state, payload: PayloadAction<any>) => {
      state.darklyFeaturesData = payload.payload;
    },
    setDarklyFeatureValue: (state, actionPayload: PayloadAction<{ feature: string; value: any }>) => {
      const { payload } = actionPayload;
      state.darklyFeaturesData = {
        ...state.darklyFeaturesData,
        [payload.feature]: payload.value,
      };
    },
    setinvoicesOrdersTab: (state, payload: PayloadAction<string>) => {
      state.invoicesOrdersTab = payload.payload;
    },
    setConentCSS: (state, payload: PayloadAction<any>) => {
      state.conentCSS = payload.payload;
    },
  },
});

export const {
  setLoading,
  setGlobalError,
  resetGlobalError,
  setCurrentTab,
  setRepairTab,
  setVivacityRepairTab,
  setInHouseRepairTab,
  setDarklyFeaturesData,
  setDarklyFeatureValue,
  setConentCSS,
  setinvoicesOrdersTab,
} = commonSlice.actions;

export default commonSlice.reducer;



