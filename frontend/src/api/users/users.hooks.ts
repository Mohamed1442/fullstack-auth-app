import type { ICustomAxiosError, IPaginationParams } from "@api/api";
import { useQuery } from "@tanstack/react-query";
import { getUserInfoApi, getUsersApi } from "./users.api";
import type { IUserResponse, TUserListResponse } from "./users.types";

const USER_INFO_QUERY_KEY = "user_info";
const USER_QUERY_KEY = "users";

export const useCurrentUserInfo = () => {
  const { data, isLoading, error } = useQuery<IUserResponse, ICustomAxiosError>(
    {
      queryKey: [USER_INFO_QUERY_KEY],
      queryFn: () => getUserInfoApi(),
    }
  );

  return { data, isLoading, error };
};

export const useUserList = (paginationParams?: IPaginationParams) => {
  const { data, isLoading, error } = useQuery<
    TUserListResponse,
    ICustomAxiosError
  >({
    queryKey: [USER_QUERY_KEY, paginationParams],
    queryFn: () => getUsersApi(paginationParams),
  });

  return { data, isLoading, error };
};
