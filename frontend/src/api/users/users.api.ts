import axiosInstance from "@api/axiosConfig";
import { usersEndpoints } from "@constants/endpoints";
import type {
  IUserResponse,
  TUserListResponse,
  TUserResponse,
} from "./users.types";
import type { IPaginationParams } from "@api/api";

export const getUserInfoApi = async (): Promise<IUserResponse> => {
  const { data } = await axiosInstance.get<TUserResponse>(
    usersEndpoints.profile
  );
  return data.data;
};

export const getUsersApi = async (
  paginationParams?: IPaginationParams
): Promise<TUserListResponse> => {
  const { data } = await axiosInstance.get<TUserListResponse>(
    usersEndpoints.admin.users,
    { params: paginationParams }
  );
  return data;
};
