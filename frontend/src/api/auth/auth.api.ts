import type {
  IAuthResponse,
  ILoginRequest,
  IRegesterRequest,
  TAuthResponse,
} from "@api/auth/auth.types";
import { authEndpoints } from "@constants/endpoints";
import envConfigKeys from "@constants/envConfig";
import axios from "axios";

const authAxiosInstance = axios.create({
  baseURL: envConfigKeys.base_url,
});

export const loginApi = async (
  payload: ILoginRequest
): Promise<IAuthResponse> => {
  const { data } = await authAxiosInstance.post<TAuthResponse>(
    authEndpoints.login,
    payload,
    { withCredentials: true }
  );

  return data.data;
};

export const signupApi = async (
  payload: IRegesterRequest
): Promise<IAuthResponse> => {
  const { data } = await authAxiosInstance.post<TAuthResponse>(
    authEndpoints.register,
    payload,
    { withCredentials: true }
  );
  return data.data;
};

export const logoutApi = (): Promise<void> =>
  authAxiosInstance.post(authEndpoints.logout);

export const refreshTokenApi = async (): Promise<IAuthResponse> => {
  const { data } = await authAxiosInstance.post<TAuthResponse>(
    authEndpoints.refreshToken,
    null,
    {
      withCredentials: true,
    }
  );
  return data.data;
};
