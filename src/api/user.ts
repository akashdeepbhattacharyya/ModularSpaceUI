import baseAPIFactory, { handleTokenHeaders, TokenParams } from './base';
import { TransformedQueryResult } from '../types/query';

const END_POINTS = {
  ACCOUNT_MANAGER: () => '/users/profile',
 
};


export const getAccountManager = async (token: string) =>
  baseAPIFactory.get(END_POINTS.ACCOUNT_MANAGER(), handleTokenHeaders({ token }));

