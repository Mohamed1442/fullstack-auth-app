import { useCurrentUserInfo } from "@api/users/users.hooks";
import type { ERole } from "@api/users/users.types";

const useRole = (allowedRoles: ERole[]): boolean => {
  const { data: user } = useCurrentUserInfo();

  return user ? allowedRoles.includes(user.role) : false;
};

export default useRole;
