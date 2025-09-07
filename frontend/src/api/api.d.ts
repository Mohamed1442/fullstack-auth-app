import type { AxiosError } from "axios";

export interface ISuccessResponse<T> {
  data: T;
}

export interface ISuccessListResponse<T> {
  data: T[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export type TCustomResponse<T> = ISuccessResponse<T>;
export type ICustomListResponse<T> = ISuccessListResponse<T>;

export interface IErrorResponse {
  error: {
    statusCode: number;
    path: string;
    timestamp: string;
    message: string[];
  };
}

export interface ICustomAxiosError extends AxiosError<IErrorResponse> {}

export interface IPaginationParams {
  page?: number;
  order?: EOrder;
  take?: number;
}

export enum EOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export type EOrder = keyof typeof EOrder;
