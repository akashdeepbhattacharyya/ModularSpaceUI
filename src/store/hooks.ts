import { useCallback, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';

type InitialProps = {
  initialData: any;
  INITIAL_DATA: any;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useTokenCallBack = () => {
  return localStorage.getItem('token') ?? '';
};

export const useTokenCallbackPromise = () => {
  const makeTokenCall = useTokenCallBack();
  return useCallback(
    () =>
      new Promise<string>((resolve) => {
        resolve(makeTokenCall);
      }),
    []
  );
};

export const useInitialData = ({ INITIAL_DATA, initialData }: InitialProps) =>
  useMemo(() => {
    const isDataEmpty = isEmpty(initialData);
    const initialValues = isDataEmpty ? INITIAL_DATA : initialData;
    return {
      isDataEmpty,
      initialValues,
      isEdit: !isDataEmpty,
    };
  }, [INITIAL_DATA, initialData]);

