import type { ICustomListResponse, TCustomResponse } from "@api/api";

export type ERole = "USER" | "ADMIN";

export const ERole = {
  USER: "USER" as ERole,
  ADMIN: "ADMIN" as ERole,
};

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export type TUserResponse = TCustomResponse<IUserResponse>;
export type TUserListResponse = ICustomListResponse<IUserResponse>;
