import { useMutation } from "@tanstack/react-query";
import { loginApi, signupApi } from "./auth.api";
import type { ILoginRequest, IRegesterRequest } from "./auth.types";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: ILoginRequest) => {
      return await loginApi(data);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: IRegesterRequest) => {
      return await signupApi(data);
    },
  });
};
