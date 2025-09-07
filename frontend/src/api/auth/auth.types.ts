import type { TCustomResponse } from "@api/api";

export interface IRegesterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export type TAuthResponse = TCustomResponse<IAuthResponse>;
