import {get, isEmpty , has} from "lodash";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
// import Config from '../infrastructure/config/config';
// import getStorage from '../infrastructure/util/Storage';
import { store } from "../store/store";
import { handleRefreshUserData } from "../slices/userSlice";
// import { STORAGE_CONTEXT_NAME } from '../constants/common';
// import { handleRefreshUserData } from '../slices/accountSlice';
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";
const baseAPIFactory = axios.create({ baseURL: BASE_URL });

export const interceptFulfilled = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("token") ?? false;
  if (token !== false) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const interceptRejected = (error: any) => Promise.reject(error);
export const interceptResponse = (response: AxiosResponse) => {
  const lastModified = get(response.headers, "x-user-modified", null);
  if (!isEmpty(lastModified) && has(store, "dispatch")) {
    store.dispatch(handleRefreshUserData(lastModified));
  }
  return response;
};

baseAPIFactory.interceptors.request.use(interceptFulfilled, interceptRejected);
baseAPIFactory.interceptors.response.use(interceptResponse, interceptRejected);

export type PaginatedResponse<T> = {
  total: string | number;
  rows: T[];
};

export type PagedResponse<T> = {
  rows: T[];
};

export interface RecordType {
  record_id: string | number;
}

export type TokenParams = {
  token?: string;
  page?: number;
  accountId?: number;
};

export const isAPIResponseFailure = (response: AxiosResponse): boolean =>
  response.status < 200 || response.status >= 300;

export function commonThenResult<T>(result: AxiosResponse<T>) {
  return result.data;
}

export const handleTokenHeaders = (props: any, extraHeaders?: any) => {
  const token = get(props, "token");
  if (!isEmpty(token)) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(extraHeaders || {}),
      },
    };
  }
  return {};
};


export default baseAPIFactory;
