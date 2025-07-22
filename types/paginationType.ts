import { FilterQuery, PopulateOptions } from 'mongoose';

export interface IPaginateOptions<T> {
  page: number;
  limit: number;
  query?: FilterQuery<T>;
  sort?: { [key: string]: 1 | -1 | 'asc' | 'desc' };
  select?: string;
  populate?: PopulateOptions | (string | PopulateOptions)[];
}

export interface IPaginationRequest {
  pageNo?: number;
  offset?: number;
  freeText?: string;
}
export interface IPaginationResponse {
  success: boolean;
  pageNo: number;
  offset: number;
  totalItems: number;
  totalPages: number;
  nextPage?: number;
  data: any[];
}